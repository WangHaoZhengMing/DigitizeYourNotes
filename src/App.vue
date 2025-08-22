<template>
  <div class="app-container">
    <!-- 语言检测提示 -->
    <div v-if="showLanguageDetection" class="language-detection-banner">
      <div class="banner-content">
        <span class="banner-icon">🌐</span>
        <span class="banner-text">
          {{ currentLanguage === 'zh' ? '检测到您的浏览器语言为中文' : 'Detected your browser language as English' }}
        </span>
        <button @click="showLanguageDetection = false" class="banner-close">×</button>
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar" :class="{ 'navbar-with-banner': showLanguageDetection }">
      <div class="nav-container">
        <div class="nav-logo">
          <h2>{{ t.nav.logo }}</h2>
        </div>
        <div class="nav-menu">
          <a href="#services" class="nav-link">{{ t.nav.services }}</a>
          <a href="#features" class="nav-link">{{ t.nav.features }}</a>
          <a href="#pricing" class="nav-link">{{ t.nav.pricing }}</a>
          <a href="#contact" class="nav-link">{{ t.nav.contact }}</a>
          <button @click="toggleLanguage" class="language-toggle">
            {{ currentLanguage === 'zh' ? 'EN' : '中文' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 主页面标题 -->
    <header class="hero-section" :class="{ 'hero-with-banner': showLanguageDetection }">
      <div class="hero-content">
        <h1 class="hero-title">{{ t.hero.title }}</h1>
        <p class="hero-subtitle">{{ t.hero.subtitle }}</p>
        <div class="hero-buttons">
          <button @click="scrollToSection('services')" class="btn btn-secondary btn-large">{{ t.hero.learnMore }}</button>
          <a :href="stripePaymentLink" target="_blank" class="btn btn-primary btn-large stripe-hero-btn">
            {{ currentLanguage === 'zh' ? '🚀 立即下单' : '🚀 Order Now' }}
          </a>
          <button @click="scrollToSection('contact')" class="btn btn-secondary btn-large">{{ t.hero.contactNow }}</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- 服务介绍 -->
      <section id="services" class="section">
        <div class="section-header">
          <h2>{{ t.sections.services.title }}</h2>
          <p>{{ t.sections.services.subtitle }}</p>
        </div>
        <div class="services-grid">
          <div class="service-card" v-for="service in services" :key="service.id">
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </section>

      <!-- 特色功能 -->
      <section id="features" class="section">
        <div class="section-header">
          <h2>{{ t.sections.features.title }}</h2>
          <p>{{ t.sections.features.subtitle }}</p>
        </div>
        <div class="features-grid">
          <div class="feature-item" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- 作品展示 -->
      <section class="section">
        <div class="section-header">
          <h2>{{ t.sections.portfolio.title }}</h2>
          <p>{{ t.sections.portfolio.subtitle }}</p>
        </div>
        
        <!-- 分类过滤器 -->
        <div class="portfolio-filters">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            class="filter-btn"
            :class="{ active: selectedCategory === category }"
          >
            {{ category === 'all' ? (currentLanguage === 'zh' ? '全部' : 'All') : category }}
          </button>
        </div>
        
        <div class="portfolio-grid">
          <div class="portfolio-item" v-for="item in portfolio" :key="item.id" @click="selectPortfolioItem(item)">
            <div class="portfolio-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.category }}</p>
          </div>
        </div>
        
        <!-- 选中的作品详情 -->
        <div v-if="selectedPortfolio" class="portfolio-detail">
          <div class="detail-card">
            <div class="detail-image">
              <img :src="selectedPortfolio.image" :alt="selectedPortfolio.title" />
            </div>
            <h3>{{ selectedPortfolio.title }}</h3>
            <p class="detail-category">{{ t.sections.portfolio.category }}{{ selectedPortfolio.category }}</p>
            <p class="detail-description">{{ selectedPortfolio.description }}</p>
            <button @click="selectedPortfolio = null" class="btn btn-secondary">{{ t.sections.portfolio.close }}</button>
          </div>
        </div>
      </section>

      <!-- 价格方案 -->
      <section id="pricing" class="section">
        <div class="section-header">
          <h2>{{ t.sections.pricing.title }}</h2>
          <p>{{ t.sections.pricing.subtitle }}</p>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card" v-for="plan in pricingPlans" :key="plan.id" :class="{ featured: plan.featured }">
            <div class="pricing-header">
              <h3>{{ plan.name }}</h3>
              <div class="price">{{ plan.price }}</div>
            </div>
            <ul class="pricing-features">
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
            <div class="pricing-actions">
              <button @click="selectPlan(plan)" class="btn btn-secondary pricing-btn">
                {{ t.sections.pricing.selectPlan }}
              </button>
              <a :href="stripePaymentLink" target="_blank" class="btn btn-primary pricing-btn">
                {{ currentLanguage === 'zh' ? '立即付款' : 'Pay Now' }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 价格计算器 -->
      <section class="section calculator-section">
        <div class="section-header">
          <h2>{{ currentLanguage === 'zh' ? '💰 价格计算器' : '💰 Price Calculator' }}</h2>
          <p>{{ currentLanguage === 'zh' ? '选择您需要的服务，自动计算总价' : 'Select your services and calculate total price automatically' }}</p>
        </div>
        
        <div class="calculator-container">
          <!-- 套餐选择 -->
          <div class="calculator-section-item">
            <h3>{{ currentLanguage === 'zh' ? '1. 选择套餐' : '1. Choose Package' }}</h3>
            <div class="package-selector">
              <div 
                v-for="plan in pricingPlans" 
                :key="plan.id"
                @click="selectCalculatorPackage(plan)"
                class="calculator-package"
                :class="{ active: selectedPackage?.id === plan.id }"
              >
                <h4>{{ plan.name }}</h4>
                <div class="calculator-price">{{ plan.price }}</div>
                <ul class="calculator-features">
                  <li v-for="feature in plan.features.slice(0, 3)" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 附加服务选择 -->
          <div class="calculator-section-item">
            <h3>{{ currentLanguage === 'zh' ? '2. 选择附加服务（可选）' : '2. Select Additional Services (Optional)' }}</h3>
            <div class="extras-selector">
              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.extraPages.enabled">
                  <span>{{ currentLanguage === 'zh' ? '额外页数' : 'Extra Pages' }}</span>
                </label>
                <div v-if="selectedExtras.extraPages.enabled" class="extra-input">
                  <input 
                    type="number" 
                    v-model="selectedExtras.extraPages.count" 
                    min="1" 
                    max="50"
                    :placeholder="currentLanguage === 'zh' ? '页数' : 'Pages'"
                  >
                  <span class="extra-unit">× $1</span>
                </div>
              </div>

              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.rushDelivery.enabled">
                  <span>{{ currentLanguage === 'zh' ? '加急交付 (24小时)' : 'Rush Delivery (24h)' }}</span>
                </label>
                <div v-if="selectedExtras.rushDelivery.enabled" class="extra-input">
                  <input 
                    type="number" 
                    v-model="selectedExtras.rushDelivery.pages" 
                    min="1" 
                    max="50"
                    :placeholder="currentLanguage === 'zh' ? '页数' : 'Pages'"
                  >
                  <span class="extra-unit">× $5</span>
                </div>
              </div>

              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.multiFormat.enabled">
                  <span>{{ currentLanguage === 'zh' ? '多格式输出' : 'Multi-format Output' }}</span>
                </label>
                <div v-if="selectedExtras.multiFormat.enabled" class="extra-input">
                  <input 
                    type="number" 
                    v-model="selectedExtras.multiFormat.count" 
                    min="1" 
                    max="5"
                    :placeholder="currentLanguage === 'zh' ? '额外格式数' : 'Extra formats'"
                  >
                  <span class="extra-unit">× $2</span>
                </div>
              </div>

              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.complexTables.enabled">
                  <span>{{ currentLanguage === 'zh' ? '复杂表格' : 'Complex Tables' }}</span>
                </label>
                <div v-if="selectedExtras.complexTables.enabled" class="extra-input">
                  <input 
                    type="number" 
                    v-model="selectedExtras.complexTables.count" 
                    min="1" 
                    max="20"
                    :placeholder="currentLanguage === 'zh' ? '表格数' : 'Tables'"
                  >
                  <span class="extra-unit">× $3</span>
                </div>
              </div>

              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.cetzGraphics.enabled">
                  <span>{{ currentLanguage === 'zh' ? 'Cetz 图形' : 'Cetz Graphics' }}</span>
                </label>
                <div v-if="selectedExtras.cetzGraphics.enabled" class="extra-input">
                  <input 
                    type="number" 
                    v-model="selectedExtras.cetzGraphics.count" 
                    min="1" 
                    max="10"
                    :placeholder="currentLanguage === 'zh' ? '图形数' : 'Graphics'"
                  >
                  <span class="extra-unit">× $10</span>
                </div>
              </div>

              <div class="extra-selector-item">
                <label class="extra-checkbox">
                  <input type="checkbox" v-model="selectedExtras.academicLayout.enabled">
                  <span>{{ currentLanguage === 'zh' ? '论文级排版' : 'Academic Layout' }}</span>
                </label>
                <div v-if="selectedExtras.academicLayout.enabled" class="extra-note">
                  <span>+$35 {{ currentLanguage === 'zh' ? '固定费用' : 'fixed fee' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 价格总计 -->
          <div class="calculator-section-item">
            <h3>{{ currentLanguage === 'zh' ? '3. 价格总计' : '3. Total Price' }}</h3>
            <div class="price-breakdown">
              <div v-if="selectedPackage" class="price-item">
                <span>{{ selectedPackage.name }}</span>
                <span>${{ getPackagePrice(selectedPackage) }}</span>
              </div>
              
              <div v-if="selectedExtras.extraPages.enabled && selectedExtras.extraPages.count > 0" class="price-item">
                <span>{{ currentLanguage === 'zh' ? '额外页数' : 'Extra Pages' }} ({{ selectedExtras.extraPages.count }})</span>
                <span>+${{ selectedExtras.extraPages.count * 1 }}</span>
              </div>

              <div v-if="selectedExtras.rushDelivery.enabled && selectedExtras.rushDelivery.pages > 0" class="price-item">
                <span>{{ currentLanguage === 'zh' ? '加急交付' : 'Rush Delivery' }} ({{ selectedExtras.rushDelivery.pages }}{{ currentLanguage === 'zh' ? '页' : ' pages' }})</span>
                <span>+${{ selectedExtras.rushDelivery.pages * 5 }}</span>
              </div>

              <div v-if="selectedExtras.multiFormat.enabled && selectedExtras.multiFormat.count > 0" class="price-item">
                <span>{{ currentLanguage === 'zh' ? '多格式输出' : 'Multi-format' }} ({{ selectedExtras.multiFormat.count }})</span>
                <span>+${{ selectedExtras.multiFormat.count * 2 }}</span>
              </div>

              <div v-if="selectedExtras.complexTables.enabled && selectedExtras.complexTables.count > 0" class="price-item">
                <span>{{ currentLanguage === 'zh' ? '复杂表格' : 'Complex Tables' }} ({{ selectedExtras.complexTables.count }})</span>
                <span>+${{ selectedExtras.complexTables.count * 3 }}</span>
              </div>

              <div v-if="selectedExtras.cetzGraphics.enabled && selectedExtras.cetzGraphics.count > 0" class="price-item">
                <span>{{ currentLanguage === 'zh' ? 'Cetz 图形' : 'Cetz Graphics' }} ({{ selectedExtras.cetzGraphics.count }})</span>
                <span>+${{ selectedExtras.cetzGraphics.count * 10 }}</span>
              </div>

              <div v-if="selectedExtras.academicLayout.enabled" class="price-item">
                <span>{{ currentLanguage === 'zh' ? '论文级排版' : 'Academic Layout' }}</span>
                <span>+$35</span>
              </div>

              <div class="price-total">
                <span>{{ currentLanguage === 'zh' ? '总计' : 'Total' }}</span>
                <span>${{ calculateTotalPrice() }}</span>
              </div>
            </div>

            <div class="calculator-actions">
              <button 
                @click="proceedToPayment" 
                :disabled="!selectedPackage || calculateTotalPrice() <= 0"
                class="btn btn-primary btn-large calculator-pay-btn"
              >
                {{ currentLanguage === 'zh' ? '立即支付 $' + calculateTotalPrice() : 'Pay Now $' + calculateTotalPrice() }}
              </button>
              <button @click="resetCalculator" class="btn btn-secondary">
                {{ currentLanguage === 'zh' ? '重置' : 'Reset' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 附加服务 -->
      <section class="section">
        <div class="section-header">
          <h2>{{ currentLanguage === 'zh' ? '🔹 附加服务' : '🔹 Additional Services' }}</h2>
          <p>{{ currentLanguage === 'zh' ? '根据您的特殊需求提供额外服务' : 'Extra services for your special requirements' }}</p>
        </div>
        <div class="extras-grid">
          <div class="extra-item">
            <div class="extra-icon">📄</div>
            <h3>{{ currentLanguage === 'zh' ? '额外页数' : 'Extra Pages' }}</h3>
            <div class="extra-price">+$1 {{ currentLanguage === 'zh' ? '/ 每页' : '/ page' }}</div>
            <p>{{ currentLanguage === 'zh' ? '超出套餐页数限制时' : 'When exceeding package page limits' }}</p>
          </div>
          
          <div class="extra-item">
            <div class="extra-icon">⚡</div>
            <h3>{{ currentLanguage === 'zh' ? '加急交付' : 'Rush Delivery' }}</h3>
            <div class="extra-price">+$5 {{ currentLanguage === 'zh' ? '/ 每页' : '/ page' }}</div>
            <p>{{ currentLanguage === 'zh' ? '24小时内完成交付' : '24-hour delivery' }}</p>
          </div>
          
          <div class="extra-item">
            <div class="extra-icon">📋</div>
            <h3>{{ currentLanguage === 'zh' ? '多格式输出' : 'Multi-format Output' }}</h3>
            <div class="extra-price">+$2 {{ currentLanguage === 'zh' ? '/ 每个额外格式' : '/ extra format' }}</div>
            <p>{{ currentLanguage === 'zh' ? '超过两种格式时' : 'When more than 2 formats needed' }}</p>
          </div>
          
          <div class="extra-item">
            <div class="extra-icon">📊</div>
            <h3>{{ currentLanguage === 'zh' ? '复杂表格' : 'Complex Tables' }}</h3>
            <div class="extra-price">+$2-5 {{ currentLanguage === 'zh' ? '/ 每个' : '/ each' }}</div>
            <p>{{ currentLanguage === 'zh' ? '跨页或特殊格式表格' : 'Cross-page or special format tables' }}</p>
          </div>
          
          <div class="extra-item">
            <div class="extra-icon">🎨</div>
            <h3>{{ currentLanguage === 'zh' ? 'Cetz 图形' : 'Cetz Graphics' }}</h3>
            <div class="extra-price">+$5-20 {{ currentLanguage === 'zh' ? '/ 每个' : '/ each' }}</div>
            <p>{{ currentLanguage === 'zh' ? '根据复杂度定价' : 'Priced by complexity' }}</p>
          </div>
          
          <div class="extra-item">
            <div class="extra-icon">📚</div>
            <h3>{{ currentLanguage === 'zh' ? '论文级排版' : 'Academic Layout' }}</h3>
            <div class="extra-price">+$20-50</div>
            <p>{{ currentLanguage === 'zh' ? '交叉引用、自动编号、参考文献' : 'Cross-refs, auto numbering, bibliography' }}</p>
          </div>
        </div>
      </section>

      <!-- 支付方式 -->
      <section class="section">
        <div class="section-header">
          <h2>{{ t.sections.payment.title }}</h2>
          <p>{{ t.sections.payment.subtitle }}</p>
        </div>
        <div class="payment-methods">
          <div class="payment-card" v-for="method in paymentMethods" :key="method.id">
            <div class="payment-icon">{{ method.icon }}</div>
            <h3>{{ method.name }}</h3>
            <p>{{ method.description }}</p>
            <div class="payment-features">
              <span v-for="feature in method.features" :key="feature" class="payment-tag">{{ feature }}</span>
            </div>
            <!-- Stripe 付款按钮 -->
            <div v-if="method.id === 1" class="payment-action">
              <a :href="stripePaymentLink" target="_blank" class="btn btn-primary payment-btn">
                {{ currentLanguage === 'zh' ? '立即付款' : 'Pay Now' }}
              </a>
            </div>
            <!-- 其他付款方式的联系提示 -->
            <div v-else class="payment-action">
              <button @click="scrollToSection('contact')" class="btn btn-secondary payment-btn">
                {{ currentLanguage === 'zh' ? '联系付款' : 'Contact to Pay' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section id="contact" class="section">
        <div class="section-header">
          <h2>{{ t.sections.contact.title }}</h2>
          <p>{{ t.sections.contact.subtitle }}</p>
        </div>
        <div class="contact-simple">
          <div class="contact-methods">
            <div class="contact-method">
              <div class="contact-icon">📧</div>
              <h4>{{ t.sections.contact.emailTitle }}</h4>
              <p class="contact-email">{{ t.footer.email }}</p>
              <small>{{ t.sections.contact.paypalZelleNote }}</small>
            </div>
            
            <div class="contact-method">
              <div class="contact-icon">💳</div>
              <h4>{{ currentLanguage === 'zh' ? 'Stripe 在线支付' : 'Stripe Online Payment' }}</h4>
              <a :href="stripePaymentLink" target="_blank" class="btn btn-primary contact-btn">
                {{ currentLanguage === 'zh' ? '立即付款' : 'Pay Now' }}
              </a>
              <small>{{ currentLanguage === 'zh' ? '安全便捷的在线支付' : 'Secure and convenient online payment' }}</small>
            </div>
            
            <div class="contact-method zelle-method">
              <div class="contact-icon">📱</div>
              <h4>Zelle {{ currentLanguage === 'zh' ? '转账' : 'Transfer' }}</h4>
              <div class="zelle-qr">
                <img :src="getImagePath('zelle.jpg')" alt="Zelle QR Code" />
              </div>
              <small>{{ currentLanguage === 'zh' ? '扫码快速转账，先发货后付款' : 'Scan to transfer quickly, work first pay later' }}</small>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>{{ t.nav.logo }}</h4>
          <p>{{ t.footer.description }}</p>
        </div>
        <div class="footer-section">
          <h4>{{ t.footer.quickLinks }}</h4>
          <a href="#services">{{ t.nav.services }}</a>
          <a href="#features">{{ t.nav.features }}</a>
          <a href="#pricing">{{ t.nav.pricing }}</a>
          <a href="#contact">{{ t.nav.contact }}</a>
        </div>
        <div class="footer-section">
          <h4>{{ t.footer.contactInfo }}</h4>
          <p>📧 {{ t.footer.email }}</p>
          <p>🌐 {{ t.footer.fiverr }}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 {{ t.nav.logo.replace('📝 ', '') }}. {{ t.footer.copyright }}</p>
      </div>
    </footer>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 检测浏览器语言
const detectBrowserLanguage = () => {
  // 获取浏览器语言
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  
  // 检查是否为中文（包括简体、繁体、香港、台湾等）
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  
  // 默认返回英文
  return 'en'
}

// 从localStorage获取保存的语言设置，如果没有则使用浏览器语言
const getSavedLanguage = () => {
  const saved = localStorage.getItem('preferred-language')
  return saved || detectBrowserLanguage()
}

// 响应式数据
const selectedPortfolio = ref(null)
const currentLanguage = ref(getSavedLanguage()) // 使用检测到的语言
const selectedCategory = ref('all') // 作品分类筛选
const showLanguageDetection = ref(false) // 是否显示语言检测提示

// 价格计算器数据
const selectedPackage = ref(null)
const selectedExtras = ref({
  extraPages: { enabled: false, count: 0 },
  rushDelivery: { enabled: false, pages: 0 },
  multiFormat: { enabled: false, count: 0 },
  complexTables: { enabled: false, count: 0 },
  cetzGraphics: { enabled: false, count: 0 },
  academicLayout: { enabled: false }
})

// Stripe 付款链接
const stripePaymentLink = 'https://buy.stripe.com/28EcN5aONazg8zL4IPd3i02'

// 多语言内容
const translations = ref({
  zh: {
    nav: {
      logo: '📝 电子化笔记服务',
      services: '服务介绍',
      features: '特色功能',
      pricing: '价格方案',
      contact: '联系我们'
    },
    hero: {
      title: '专业电子化笔记与试卷服务',
      subtitle: '美观且工整的数字化学习解决方案',
      learnMore: '了解服务',
      contactNow: '立即联系'
    },
    sections: {
      services: {
        title: '🎯 我们的服务',
        subtitle: '专业的电子化笔记和试卷制作服务'
      },
      features: {
        title: '✨ 特色功能',
        subtitle: '为什么选择我们的服务'
      },
      portfolio: {
        title: '📖 作品展示',
        subtitle: '查看我们的精品案例',
        close: '关闭',
        category: '类别：'
      },
      pricing: {
        title: '💰 价格方案',
        subtitle: '灵活的付费方式，满足不同需求',
        selectPlan: '选择方案',
        featured: '推荐'
      },
      payment: {
        title: '💳 支付方式',
        subtitle: '多种便捷的支付选择'
      },
      contact: {
        title: '📞 联系我们',
        subtitle: '随时为您提供专业服务',
        emailTitle: '邮箱联系',
        fiverrTitle: 'Fiverr 平台',
        fiverrPlatform: '专业服务平台',
        visitFiverr: '访问我的 Fiverr 店铺',
        fiverrNote: '注：平台价格略高',
        quickInquiry: '快速咨询',
        namePlaceholder: '您的姓名',
        emailPlaceholder: '您的邮箱',
        serviceSelect: '选择服务类型',
        messagePlaceholder: '详细需求描述...',
        sendInquiry: '发送咨询',
        paypalZelleNote: 'PayPal 和 Zelle 可以先发货再付钱'
      }
    },
    footer: {
      description: '专业、美观、工整的数字化学习解决方案',
      quickLinks: '快速链接',
      contactInfo: '联系信息',
      copyright: '专业品质，值得信赖.',
      email: 'haut.cn@icloud.com',
      fiverr: 'Fiverr 专业服务'
    },
    success: {
      title: '咨询已发送！',
      message: '我们会尽快通过邮箱回复您',
      confirm: '确定'
    },
    serviceOptions: {
      notes: '电子化笔记',
      exam: '试卷制作',
      both: '两者都需要'
    }
  },
  en: {
    nav: {
      logo: '📝 Digital Note Service',
      services: 'Services',
      features: 'Features',
      pricing: 'Pricing',
      contact: 'Contact'
    },
    hero: {
      title: 'Professional Digital Note & Exam Services',
      subtitle: 'Beautiful and well-formatted digital learning solutions',
      learnMore: 'Learn More',
      contactNow: 'Contact Now'
    },
    sections: {
      services: {
        title: '🎯 Our Services',
        subtitle: 'Professional digital note-taking and exam preparation services'
      },
      features: {
        title: '✨ Key Features',
        subtitle: 'Why choose our services'
      },
      portfolio: {
        title: '📖 Portfolio',
        subtitle: 'View our premium work samples',
        close: 'Close',
        category: 'Category:'
      },
      pricing: {
        title: '💰 Pricing Plans',
        subtitle: 'Flexible payment options for different needs',
        selectPlan: 'Select Plan',
        featured: 'Recommended'
      },
      payment: {
        title: '💳 Payment Methods',
        subtitle: 'Multiple convenient payment options'
      },
      contact: {
        title: '📞 Contact Us',
        subtitle: 'Professional services available anytime',
        emailTitle: 'Email Contact',
        fiverrTitle: 'Fiverr Platform',
        fiverrPlatform: 'Professional service platform',
        visitFiverr: 'Visit My Fiverr Store',
        fiverrNote: 'Note: Platform prices are slightly higher',
        quickInquiry: 'Quick Inquiry',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'Your Email',
        serviceSelect: 'Select Service Type',
        messagePlaceholder: 'Detailed requirements...',
        sendInquiry: 'Send Inquiry',
        paypalZelleNote: 'PayPal and Zelle: Work first, pay later'
      }
    },
    footer: {
      description: 'Professional, beautiful, and well-formatted digital learning solutions',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Information',
      copyright: 'Professional quality you can trust.',
      email: 'haut.cn@icloud.com',
      fiverr: 'Fiverr Professional Services'
    },
    success: {
      title: 'Inquiry Sent!',
      message: 'We will reply to you via email soon',
      confirm: 'OK'
    },
    serviceOptions: {
      notes: 'Digital Notes',
      exam: 'Exam Papers',
      both: 'Both Services'
    }
  }
})

// 服务数据
const servicesData = ref({
  zh: [
    {
      id: 1,
      icon: '📝',
      title: '电子化笔记',
      description: '将手写笔记转换为精美的电子版本，支持多种格式，排版工整美观'
    },
    {
      id: 2,
      icon: '📋',
      title: '试卷制作',
      description: '专业的试卷排版设计，包含题目格式化、答案整理等完整服务'
    },
    {
      id: 3,
      icon: '🎨',
      title: '格式优化',
      description: '对现有文档进行美化处理，提升视觉效果和阅读体验'
    },
    {
      id: 4,
      icon: '⚡',
      title: '快速交付',
      description: '高效的工作流程，确保在约定时间内完成高质量的作品'
    }
  ],
  en: [
    {
      id: 1,
      icon: '📝',
      title: 'Digital Notes',
      description: 'Convert handwritten notes into beautiful digital versions with multiple formats and professional layout'
    },
    {
      id: 2,
      icon: '📋',
      title: 'Exam Papers',
      description: 'Professional exam paper design including question formatting and comprehensive answer organization'
    },
    {
      id: 3,
      icon: '🎨',
      title: 'Format Optimization',
      description: 'Enhance existing documents with improved visual effects and reading experience'
    },
    {
      id: 4,
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Efficient workflow ensuring high-quality work completion within agreed timeframes'
    }
  ]
})

// 特色功能
const featuresData = ref({
  zh: [
    {
      id: 1,
      icon: '✨',
      title: '专业排版',
      description: '采用专业排版软件，确保文档格式规范、美观大方'
    },
    {
      id: 2,
      icon: '🎯',
      title: '精准还原',
      description: '忠实还原原稿内容，保持学术严谨性和准确性'
    },
    {
      id: 3,
      icon: '📱',
      title: '多格式支持',
      description: '支持PDF、Word、PowerPoint等多种常用格式输出'
    },
    {
      id: 4,
      icon: '🔄',
      title: '修改服务',
      description: '提供后续修改服务，确保客户完全满意'
    },
    {
      id: 5,
      icon: '🛡️',
      title: '隐私保护',
      description: '严格保护客户隐私，完成后删除所有原始文件'
    },
    {
      id: 6,
      icon: '💎',
      title: '品质保证',
      description: '每份作品都经过多重质量检查，确保无误交付'
    }
  ],
  en: [
    {
      id: 1,
      icon: '✨',
      title: 'Professional Layout',
      description: 'Using professional typesetting software to ensure standardized and beautiful document formatting'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Accurate Recreation',
      description: 'Faithful reproduction of original content while maintaining academic rigor and accuracy'
    },
    {
      id: 3,
      icon: '📱',
      title: 'Multi-format Support',
      description: 'Support for PDF, Word, PowerPoint and other commonly used format outputs'
    },
    {
      id: 4,
      icon: '🔄',
      title: 'Revision Service',
      description: 'Providing follow-up revision services to ensure complete customer satisfaction'
    },
    {
      id: 5,
      icon: '🛡️',
      title: 'Privacy Protection',
      description: 'Strict customer privacy protection, all original files deleted after completion'
    },
    {
      id: 6,
      icon: '💎',
      title: 'Quality Assurance',
      description: 'Every piece of work undergoes multiple quality checks to ensure error-free delivery'
    }
  ]
})

// 作品展示
// 图片路径处理函数
const getImagePath = (imageName) => {
  return `./Img/${imageName}`;
};

const portfolioData = ref({
  zh: [
    {
      id: 1,
      image: getImagePath('数学.png'),
      title: '高等数学笔记',
      category: '课程笔记',
      description: '完整的数学课程笔记，包含定理证明、例题解析和重点标注，格式工整，便于复习。采用专业排版，公式清晰美观。'
    },
    {
      id: 2,
      image: getImagePath('数学公式.png'),
      title: '数学公式整理',
      category: '公式汇总',
      description: '系统整理的数学公式集合，分类明确，排版精美，便于查阅和记忆。包含各种数学符号和复杂公式。'
    },
    {
      id: 3,
      image: getImagePath('物理公式.png'),
      title: '物理公式汇总',
      category: '公式整理',
      description: '物理学重要公式的专业整理，包含力学、电磁学、热学等各个分支的核心公式，排版规范。'
    },
    {
      id: 4,
      image: getImagePath('算法笔记分析.png'),
      title: '算法笔记分析',
      category: '编程笔记',
      description: '算法学习笔记的专业整理，包含算法思路分析、代码实现和复杂度分析，适合程序员学习。'
    },
    {
      id: 5,
      image: getImagePath('Java试卷.png'),
      title: 'Java程序设计试卷',
      category: '试卷制作',
      description: '专业的Java编程考试试卷，题目分类清晰，代码格式规范，答题空间合理，符合考试标准。'
    },
    {
      id: 6,
      image: getImagePath('英语小作业.png'),
      title: '英语作业整理',
      category: '作业笔记',
      description: '英语学习作业的规范整理，包含语法练习、词汇总结等内容，排版清晰易读。'
    },
    {
      id: 7,
      image: getImagePath('复杂图表.png'),
      title: '复杂图表制作',
      category: '图表设计',
      description: '专业的图表设计和数据可视化，包含各种复杂图形、表格和统计图，美观实用。'
    },
    {
      id: 8,
      image: getImagePath('试卷中的复杂图.png'),
      title: '试卷图形处理',
      category: '试卷制作',
      description: '试卷中复杂图形的专业处理，包含几何图形、函数图像等，确保图形清晰准确。'
    },
    {
      id: 9,
      image: getImagePath('文字整理.png'),
      title: '文字内容整理',
      category: '文档整理',
      description: '各类文字内容的专业整理和排版，注重版式设计和阅读体验，适合学术文档。'
    },
    {
      id: 10,
      image: getImagePath('长文本，论文整理.png'),
      title: '论文长文本整理',
      category: '学术论文',
      description: '学术论文和长文本的专业排版，包含标题层次、段落格式、引用规范等，符合学术标准。'
    }
  ],
  en: [
    {
      id: 1,
      image: '/Img/数学.png',
      title: 'Mathematics Course Notes',
      category: 'Course Notes',
      description: 'Complete mathematics course notes with theorem proofs, example analysis, and key annotations. Professional layout with clear and beautiful formulas.'
    },
    {
      id: 2,
      image: getImagePath('数学公式.png'),
      title: 'Mathematics Formula Collection',
      category: 'Formula Summary',
      description: 'Systematically organized mathematical formulas with clear categorization and elegant layout, perfect for reference and memorization.'
    },
    {
      id: 3,
      image: getImagePath('物理公式.png'),
      title: 'Physics Formula Compilation',
      category: 'Formula Organization',
      description: 'Professional compilation of important physics formulas covering mechanics, electromagnetism, thermodynamics with standardized formatting.'
    },
    {
      id: 4,
      image: getImagePath('算法笔记分析.png'),
      title: 'Algorithm Notes Analysis',
      category: 'Programming Notes',
      description: 'Professional organization of algorithm learning notes including algorithmic thinking, code implementation, and complexity analysis.'
    },
    {
      id: 5,
      image: getImagePath('Java试卷.png'),
      title: 'Java Programming Exam Paper',
      category: 'Exam Creation',
      description: 'Professional Java programming exam paper with clear question categorization, standardized code formatting, and appropriate answer space.'
    },
    {
      id: 6,
      image: getImagePath('英语小作业.png'),
      title: 'English Assignment Organization',
      category: 'Assignment Notes',
      description: 'Standardized organization of English learning assignments including grammar exercises and vocabulary summaries with clear layout.'
    },
    {
      id: 7,
      image: getImagePath('复杂图表.png'),
      title: 'Complex Chart Design',
      category: 'Chart Design',
      description: 'Professional chart design and data visualization including various complex graphics, tables, and statistical charts.'
    },
    {
      id: 8,
      image: getImagePath('试卷中的复杂图.png'),
      title: 'Exam Paper Graphics Processing',
      category: 'Exam Creation',
      description: 'Professional processing of complex graphics in exam papers including geometric figures and function graphs with clarity and accuracy.'
    },
    {
      id: 9,
      image: getImagePath('文字整理.png'),
      title: 'Text Content Organization',
      category: 'Document Organization',
      description: 'Professional organization and layout of various text content with focus on design and reading experience for academic documents.'
    },
    {
      id: 10,
      image: getImagePath('长文本，论文整理.png'),
      title: 'Academic Paper Long Text',
      category: 'Academic Papers',
      description: 'Professional typesetting of academic papers and long texts including title hierarchy, paragraph formatting, and citation standards.'
    }
  ]
})

// 价格方案
const pricingPlansData = ref({
  zh: [
    {
      id: 1,
      name: '🟢 Basic 基础包',
      price: '$4',
      features: [
        '1-8页内容处理',
        '手写转 Word/Markdown/Typst/PDF',
        '少量公式（≤5个）',
        '简单表格（≤2个）',
        '通常0.5天交付'
      ],
      featured: false
    },
    {
      id: 2,
      name: '🟡 Standard 标准包',
      price: '$20',
      features: [
        '8-16页内容处理',
        '转换为 Word/Typst（LaTeX公式）',
        '中等数量公式（≤20个）',
        '表格处理（≤5个，复杂重绘）',
        '简单图形 Cetz重绘（≤2个）',
        '2-3天交付'
      ],
      featured: true
    },
    {
      id: 3,
      name: '🔴 Premium 高级包',
      price: '$60-100',
      features: [
        '9-15页完整电子化',
        '多格式输出（Typst/Word/Markdown/PDF）',
        '复杂公式不限（矩阵、积分、求和等）',
        '学术标准表格重绘',
        'Cetz复杂图形（≤5个）',
        '自动目录 + 专业排版',
        '一次免费修改',
        '3-5天交付'
      ],
      featured: false
    }
  ],
  en: [
    {
      id: 1,
      name: '🟢 Basic Package',
      price: '$4',
      features: [
        '1-8 pages processing',
        'Handwriting to Word/Markdown/Typst/PDF',
        'Few formulas (≤5)',
        'Simple tables (≤2)',
        'Usually 0.5 day delivery'
      ],
      featured: false
    },
    {
      id: 2,
      name: '🟡 Standard Package',
      price: '$20',
      features: [
        '8-16 pages processing',
        'Convert to Word/Typst (LaTeX formulas)',
        'Medium formulas (≤20, no fractions)',
        'Tables (≤5, complex redrawn)',
        'Simple graphics Cetz redraw (≤2)',
        '2-3 days delivery'
      ],
      featured: true
    },
    {
      id: 3,
      name: '🔴 Premium Package',
      price: '$60-100',
      features: [
        '9-15 pages full digitization',
        'Multi-format output (Typst/Word/Markdown/PDF)',
        'Unlimited complex formulas (matrices, integrals)',
        'Academic standard table redraw',
        'Cetz complex graphics (≤5)',
        'Auto TOC + professional layout',
        'One free revision',
        '3-5 days delivery'
      ],
      featured: false
    }
  ]
})

// 支付方式
const paymentMethodsData = ref({
  zh: [
    {
      id: 1,
      icon: '💳',
      name: 'Stripe',
      description: '国际信用卡支付，安全便捷',
      features: ['即时到账', '全球支持', '安全加密']
    },
    {
      id: 2,
      icon: '🏦',
      name: 'PayPal',
      description: '全球知名支付平台',
      features: ['先发货后付款', '买家保护', '便捷转账']
    },
    {
      id: 3,
      icon: '📱',
      name: 'Zelle',
      description: '美国银行间快速转账',
      features: ['先发货后付款', '即时到账', '无手续费']
    }
  ],
  en: [
    {
      id: 1,
      icon: '💳',
      name: 'Stripe',
      description: 'International credit card payment, secure and convenient',
      features: ['Instant payment', 'Global support', 'Secure encryption']
    },
    {
      id: 2,
      icon: '🏦',
      name: 'PayPal',
      description: 'World-renowned payment platform',
      features: ['Work first, pay later', 'Buyer protection', 'Easy transfer']
    },
    {
      id: 3,
      icon: '📱',
      name: 'Zelle',
      description: 'US bank-to-bank instant transfer',
      features: ['Work first, pay later', 'Instant payment', 'No fees']
    }
  ]
})

// 计算属性 - 获取当前语言的数据
const t = computed(() => translations.value[currentLanguage.value])
const services = computed(() => servicesData.value[currentLanguage.value])
const features = computed(() => featuresData.value[currentLanguage.value])
const portfolio = computed(() => {
  const items = portfolioData.value[currentLanguage.value]
  if (selectedCategory.value === 'all') {
    return items
  }
  return items.filter(item => item.category === selectedCategory.value)
})
const pricingPlans = computed(() => pricingPlansData.value[currentLanguage.value])
const paymentMethods = computed(() => paymentMethodsData.value[currentLanguage.value])

// 获取所有分类
const categories = computed(() => {
  const items = portfolioData.value[currentLanguage.value]
  const cats = ['all', ...new Set(items.map(item => item.category))]
  return cats
})

// 方法
const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'zh' ? 'en' : 'zh'
  currentLanguage.value = newLang
  
  // 保存用户的语言选择到localStorage
  localStorage.setItem('preferred-language', newLang)
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const selectPortfolioItem = (item) => {
  selectedPortfolio.value = item
}

const selectPlan = (plan) => {
  // 滚动到联系部分
  scrollToSection('contact')
}

// 价格计算器方法
const selectCalculatorPackage = (plan) => {
  selectedPackage.value = plan
}

const getPackagePrice = (plan) => {
  // 提取价格中的数字，取最低价格
  const priceMatch = plan.price.match(/\$(\d+)/)
  return priceMatch ? parseInt(priceMatch[1]) : 0
}

const calculateTotalPrice = () => {
  if (!selectedPackage.value) return 0
  
  let total = getPackagePrice(selectedPackage.value)
  
  // 计算附加服务费用
  if (selectedExtras.value.extraPages.enabled) {
    total += (selectedExtras.value.extraPages.count || 0) * 1
  }
  
  if (selectedExtras.value.rushDelivery.enabled) {
    total += (selectedExtras.value.rushDelivery.pages || 0) * 5
  }
  
  if (selectedExtras.value.multiFormat.enabled) {
    total += (selectedExtras.value.multiFormat.count || 0) * 2
  }
  
  if (selectedExtras.value.complexTables.enabled) {
    total += (selectedExtras.value.complexTables.count || 0) * 3
  }
  
  if (selectedExtras.value.cetzGraphics.enabled) {
    total += (selectedExtras.value.cetzGraphics.count || 0) * 10
  }
  
  if (selectedExtras.value.academicLayout.enabled) {
    total += 35
  }
  
  return total
}

const resetCalculator = () => {
  selectedPackage.value = null
  selectedExtras.value = {
    extraPages: { enabled: false, count: 0 },
    rushDelivery: { enabled: false, pages: 0 },
    multiFormat: { enabled: false, count: 0 },
    complexTables: { enabled: false, count: 0 },
    cetzGraphics: { enabled: false, count: 0 },
    academicLayout: { enabled: false }
  }
}

const proceedToPayment = async () => {
  const totalPrice = calculateTotalPrice()
  if (totalPrice <= 0 || !selectedPackage.value) {
    alert(currentLanguage.value === 'zh' ? '请先选择套餐' : 'Please select a package first')
    return
  }
  
  try {
    // 显示加载状态
    const payButton = document.querySelector('.calculator-pay-btn')
    const originalText = payButton.textContent
    payButton.textContent = currentLanguage.value === 'zh' ? '创建支付会话...' : 'Creating payment session...'
    payButton.disabled = true
    
    // 准备订单数据
    const orderData = {
      packageInfo: {
        id: selectedPackage.value.id,
        name: selectedPackage.value.name,
        price: selectedPackage.value.price,
        features: selectedPackage.value.features
      },
      extras: selectedExtras.value,
      totalAmount: totalPrice,
      currency: 'usd',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`
    }
    
    console.log('Creating checkout session with data:', orderData)
    
    // 调用后端API创建Stripe Checkout Session
    const response = await fetch('http://localhost:3001/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create checkout session')
    }
    
    const { sessionId, url } = await response.json()
    
    console.log('Checkout session created:', { sessionId, url })
    
    // 跳转到Stripe Checkout页面
    if (url) {
      window.location.href = url
    } else {
      throw new Error('No checkout URL received')
    }
    
  } catch (error) {
    console.error('Payment error:', error)
    
    // 显示错误信息
    const errorMessage = currentLanguage.value === 'zh' 
      ? '创建支付会话失败，请稍后重试' 
      : 'Failed to create payment session, please try again'
    
    alert(errorMessage)
    
    // 恢复按钮状态
    const payButton = document.querySelector('.calculator-pay-btn')
    payButton.textContent = currentLanguage.value === 'zh' 
      ? `立即支付 $${calculateTotalPrice()}` 
      : `Pay Now $${calculateTotalPrice()}`
    payButton.disabled = false
  }
}

// 初始化语言检测
const initializeLanguageDetection = () => {
  const saved = localStorage.getItem('preferred-language')
  const detected = detectBrowserLanguage()
  
  // 如果没有保存的语言设置，且检测到的语言与当前不同，显示提示
  if (!saved && detected !== currentLanguage.value) {
    showLanguageDetection.value = true
    
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showLanguageDetection.value = false
    }, 5000)
  }
}

// 页面加载时初始化
onMounted(() => {
  initializeLanguageDetection()
})
</script>

<style scoped>
/* 全局样式 */
.app-container {
  width: 100%;
  margin: 0;
  padding: 0;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* 语言检测提示横幅 */
.language-detection-banner {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 0.8rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.banner-icon {
  font-size: 1.2rem;
}

.banner-text {
  font-weight: 500;
  font-size: 0.9rem;
}

.banner-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.banner-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 导航栏 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transition: top 0.3s ease;
}

/* 当显示语言检测横幅时，导航栏向下移动 */
.navbar-with-banner {
  top: 60px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo h2 {
  margin: 0;
  color: #667eea;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
}

.language-toggle {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 1rem;
}

.language-toggle:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 主页面标题 */
.hero-section {
  padding: 120px 2rem 80px;
  text-align: center;
  color: white;
  transition: padding-top 0.3s ease;
}

.hero-with-banner {
  padding-top: 180px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 主要内容区域 */
.main-content {
  background: #f8f9fa;
  padding: 0;
}

.section {
  padding: 80px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section:nth-child(even) {
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.2rem;
  color: #666;
}

/* 服务网格 */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.service-card p {
  color: #666;
  line-height: 1.6;
}

/* 特色功能网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.feature-item p {
  color: #666;
  margin: 0;
}

/* 作品展示 */
.portfolio-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.filter-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.portfolio-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.portfolio-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.portfolio-image {
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio-item:hover .portfolio-image img {
  transform: scale(1.05);
}

.portfolio-item h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.portfolio-item p {
  color: #667eea;
  font-weight: 500;
}

.portfolio-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.detail-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 800px;
  max-height: 90vh;
  margin: 2rem;
  text-align: center;
  overflow-y: auto;
}

.detail-image {
  width: 100%;
  max-height: 400px;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
}

.detail-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
}

.detail-category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.detail-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* 价格方案 */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-10px);
}

.pricing-card.featured {
  border: 3px solid #667eea;
  transform: scale(1.05);
}

.pricing-card.featured::before {
  content: '推荐';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.pricing-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 2rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.pricing-features li {
  padding: 0.5rem 0;
  color: #666;
  border-bottom: 1px solid #eee;
}

.pricing-features li:last-child {
  border-bottom: none;
}

.pricing-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pricing-btn {
  width: 100%;
  padding: 1rem 1.2rem;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.payment-action {
  margin-top: 1.5rem;
}

.payment-btn {
  width: 100%;
  padding: 1rem 1.8rem;
  font-size: 1rem;
}

/* 价格计算器 */
.calculator-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.calculator-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.calculator-section-item {
  margin-bottom: 3rem;
}

.calculator-section-item:last-child {
  margin-bottom: 0;
}

.calculator-section-item h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

/* 套餐选择器 */
.package-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.calculator-package {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calculator-package:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.calculator-package.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.calculator-package h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.calculator-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;
}

.calculator-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calculator-features li {
  color: #666;
  font-size: 0.9rem;
  padding: 0.2rem 0;
  border-bottom: 1px solid #eee;
}

.calculator-features li:last-child {
  border-bottom: none;
}

/* 附加服务选择器 */
.extras-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.extra-selector-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.extra-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.extra-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.extra-checkbox span {
  font-weight: 600;
  color: #333;
}

.extra-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1.5rem;
}

.extra-input input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.extra-unit {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

.extra-note {
  margin-left: 1.5rem;
  color: #667eea;
  font-weight: 600;
}

/* 价格明细 */
.price-breakdown {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid #e9ecef;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e9ecef;
  color: #666;
}

.price-item:last-child {
  border-bottom: none;
}

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0 0;
  margin-top: 1rem;
  border-top: 2px solid #667eea;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

.price-total span:last-child {
  color: #667eea;
  font-size: 1.5rem;
}

/* 计算器操作按钮 */
.calculator-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.calculator-pay-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.calculator-pay-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.calculator-pay-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 附加服务 */
.extras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.extra-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid transparent;
}

.extra-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.extra-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.extra-item h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.extra-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 25px;
  display: inline-block;
}

.extra-item p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 支付方式 */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.payment-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.payment-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.payment-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.payment-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.payment-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.payment-tag {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

/* 联系方式 */
.contact-simple {
  max-width: 1000px;
  margin: 0 auto;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  align-items: start;
}

.contact-method {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-method:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-method h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.contact-email {
  font-size: 1.1rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
  word-break: break-all;
}

.contact-method small {
  color: #999;
  font-style: italic;
  line-height: 1.4;
}

.contact-btn {
  margin: 1rem 0;
  padding: 1rem 1.8rem;
  font-size: 1rem;
  font-weight: 600;
}

.zelle-method {
  border: 2px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.zelle-qr {
  width: 200px;
  height: 200px;
  margin: 1rem auto;
  border-radius: 15px;
  overflow: hidden;
  background: white;
  padding: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.zelle-qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 按钮样式 */
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
  text-align: center;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

.btn-full {
  width: 100%;
}

.stripe-hero-btn {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

.stripe-hero-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  }
  100% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
}

/* 页脚 */
.footer {
  background: #2d3748;
  color: white;
  padding: 4rem 2rem 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  color: #667eea;
  margin-bottom: 1rem;
}

.footer-section a {
  color: #a0aec0;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #667eea;
}

.footer-section p {
  color: #a0aec0;
  margin-bottom: 0.5rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #4a5568;
  color: #a0aec0;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .nav-link {
    display: none;
  }
  
  .language-toggle {
    margin-left: 0;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section {
    padding: 60px 1rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .services-grid,
  .features-grid,
  .portfolio-grid,
  .pricing-grid,
  .extras-grid,
  .payment-methods {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-logo h2 {
    font-size: 1.2rem;
  }
  
  .hero-section {
    padding: 100px 1rem 60px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section {
    padding: 40px 1rem;
  }
  
  .service-card,
  .contact-method,
  .detail-card {
    padding: 1.5rem;
  }
  
  .zelle-qr {
    width: 150px;
    height: 150px;
  }
  
  .pricing-btn,
  .payment-btn,
  .contact-btn {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
  }
  
  /* 计算器移动端样式 */
  .calculator-container {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
  
  .package-selector {
    grid-template-columns: 1fr;
  }
  
  .extras-selector {
    grid-template-columns: 1fr;
  }
  
  .calculator-actions {
    flex-direction: column;
  }
  
  .calculator-actions .btn {
    width: 100%;
  }
}
</style>
