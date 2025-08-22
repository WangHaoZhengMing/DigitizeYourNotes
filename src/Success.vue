<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-icon">✅</div>
      <h1>{{ currentLanguage === 'zh' ? '支付成功！' : 'Payment Successful!' }}</h1>
      <p class="success-message">
        {{ currentLanguage === 'zh' 
          ? '感谢您的订购！我们已收到您的付款，将尽快开始处理您的订单。' 
          : 'Thank you for your order! We have received your payment and will start processing your order soon.' 
        }}
      </p>
      
      <div v-if="orderDetails" class="order-details">
        <h3>{{ currentLanguage === 'zh' ? '订单详情' : 'Order Details' }}</h3>
        <div class="detail-item">
          <span>{{ currentLanguage === 'zh' ? '订单号：' : 'Order ID:' }}</span>
          <span>{{ sessionId }}</span>
        </div>
        <div class="detail-item">
          <span>{{ currentLanguage === 'zh' ? '总金额：' : 'Total Amount:' }}</span>
          <span>${{ (orderDetails.amountTotal / 100).toFixed(2) }}</span>
        </div>
        <div v-if="orderDetails.customerEmail" class="detail-item">
          <span>{{ currentLanguage === 'zh' ? '邮箱：' : 'Email:' }}</span>
          <span>{{ orderDetails.customerEmail }}</span>
        </div>
      </div>

      <div class="next-steps">
        <h3>{{ currentLanguage === 'zh' ? '接下来的步骤' : 'Next Steps' }}</h3>
        <ol>
          <li>{{ currentLanguage === 'zh' ? '您将收到订单确认邮件' : 'You will receive an order confirmation email' }}</li>
          <li>{{ currentLanguage === 'zh' ? '我们会在24小时内联系您确认项目细节' : 'We will contact you within 24 hours to confirm project details' }}</li>
          <li>{{ currentLanguage === 'zh' ? '请准备好您需要电子化的文件' : 'Please prepare your files for digitization' }}</li>
        </ol>
      </div>

      <div class="action-buttons">
        <button @click="goHome" class="btn btn-primary">
          {{ currentLanguage === 'zh' ? '返回首页' : 'Back to Home' }}
        </button>
        <button @click="contactUs" class="btn btn-secondary">
          {{ currentLanguage === 'zh' ? '联系我们' : 'Contact Us' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentLanguage = ref('zh')
const sessionId = ref('')
const orderDetails = ref(null)
const loading = ref(true)

onMounted(async () => {
  // 获取URL参数中的session_id
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('session_id')
  
  if (id) {
    sessionId.value = id
    await fetchOrderDetails(id)
  }
  
  loading.value = false
})

const fetchOrderDetails = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/checkout-session/${id}`)
    if (response.ok) {
      orderDetails.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
  }
}

const goHome = () => {
  window.location.href = '/'
}

const contactUs = () => {
  window.location.href = '/#contact'
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.success-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.success-message {
  color: #666;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.order-details {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.order-details h3 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.next-steps {
  text-align: left;
  margin-bottom: 2rem;
}

.next-steps h3 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.next-steps ol {
  color: #666;
  line-height: 1.6;
}

.next-steps li {
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .success-container {
    padding: 2rem 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
