const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));
app.use(express.json());

// 创建动态 Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { 
      packageInfo, 
      extras, 
      totalAmount, 
      currency = 'usd',
      customerEmail,
      successUrl,
      cancelUrl 
    } = req.body;

    // 验证必需参数
    if (!packageInfo || !totalAmount) {
      return res.status(400).json({ 
        error: 'Missing required parameters: packageInfo and totalAmount' 
      });
    }

    // 构建订单详情描述
    const orderDetails = {
      package: packageInfo.name,
      packagePrice: packageInfo.price,
      extras: extras || {},
      totalAmount: totalAmount
    };

    // 构建 line items 数组
    const lineItems = [];

    // 添加主套餐
    lineItems.push({
      price_data: {
        currency: currency,
        product_data: {
          name: packageInfo.name,
          description: `${packageInfo.features.slice(0, 3).join(', ')}`,
          images: [], // 可以添加产品图片
        },
        unit_amount: Math.round(parseFloat(packageInfo.price.replace(/[^0-9.-]+/g, "")) * 100), // 转换为分
      },
      quantity: 1,
    });

    // 添加附加服务
    if (extras) {
      if (extras.extraPages && extras.extraPages.enabled && extras.extraPages.count > 0) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: '额外页数 / Extra Pages',
              description: `${extras.extraPages.count} pages`,
            },
            unit_amount: 100, // $1 per page
          },
          quantity: extras.extraPages.count,
        });
      }

      if (extras.rushDelivery && extras.rushDelivery.enabled && extras.rushDelivery.pages > 0) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: '加急交付 / Rush Delivery',
              description: `24-hour delivery for ${extras.rushDelivery.pages} pages`,
            },
            unit_amount: 500, // $5 per page
          },
          quantity: extras.rushDelivery.pages,
        });
      }

      if (extras.multiFormat && extras.multiFormat.enabled && extras.multiFormat.count > 0) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: '多格式输出 / Multi-format Output',
              description: `${extras.multiFormat.count} additional formats`,
            },
            unit_amount: 200, // $2 per format
          },
          quantity: extras.multiFormat.count,
        });
      }

      if (extras.complexTables && extras.complexTables.enabled && extras.complexTables.count > 0) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: '复杂表格 / Complex Tables',
              description: `${extras.complexTables.count} complex tables`,
            },
            unit_amount: 300, // $3 per table
          },
          quantity: extras.complexTables.count,
        });
      }

      if (extras.cetzGraphics && extras.cetzGraphics.enabled && extras.cetzGraphics.count > 0) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: 'Cetz 图形 / Cetz Graphics',
              description: `${extras.cetzGraphics.count} custom graphics`,
            },
            unit_amount: 1000, // $10 per graphic
          },
          quantity: extras.cetzGraphics.count,
        });
      }

      if (extras.academicLayout && extras.academicLayout.enabled) {
        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: '论文级排版 / Academic Layout',
              description: 'Professional academic formatting with cross-references',
            },
            unit_amount: 3500, // $35 fixed fee
          },
          quantity: 1,
        });
      }
    }

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/cancel`,
      customer_email: customerEmail,
      metadata: {
        orderDetails: JSON.stringify(orderDetails),
        timestamp: new Date().toISOString(),
      },
      // 可选：收集客户信息
      billing_address_collection: 'required',
      // 可选：设置过期时间（24小时）
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    });

    console.log('Checkout session created:', {
      sessionId: session.id,
      orderDetails: orderDetails,
      totalAmount: totalAmount
    });

    res.json({ 
      sessionId: session.id,
      url: session.url,
      orderDetails: orderDetails
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// 验证支付状态
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      orderDetails: session.metadata?.orderDetails ? JSON.parse(session.metadata.orderDetails) : null
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve checkout session',
      details: error.message 
    });
  }
});

// Stripe Webhook 处理
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理事件
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
        orderDetails: session.metadata?.orderDetails
      });
      
      // 这里可以添加你的业务逻辑：
      // - 发送确认邮件
      // - 保存订单到数据库
      // - 启动工作流程等
      
      break;
    
    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id);
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripeConnected: !!stripe 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Stripe integration ready`);
});
