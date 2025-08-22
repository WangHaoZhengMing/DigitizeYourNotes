<template>
  <div class="cancel-page">
    <div class="cancel-container">
      <div class="cancel-icon">❌</div>
      <h1>{{ currentLanguage === 'zh' ? '支付已取消' : 'Payment Cancelled' }}</h1>
      <p class="cancel-message">
        {{ currentLanguage === 'zh' 
          ? '您已取消了支付过程。如果您改变主意，随时可以重新下单。' 
          : 'You have cancelled the payment process. You can always come back and place an order when you\'re ready.' 
        }}
      </p>
      
      <div class="help-section">
        <h3>{{ currentLanguage === 'zh' ? '需要帮助？' : 'Need Help?' }}</h3>
        <p>
          {{ currentLanguage === 'zh' 
            ? '如果您在支付过程中遇到问题，或者有任何疑问，请随时联系我们。' 
            : 'If you encountered any issues during the payment process or have questions, please feel free to contact us.' 
          }}
        </p>
      </div>

      <div class="action-buttons">
        <button @click="goBack" class="btn btn-primary">
          {{ currentLanguage === 'zh' ? '重新计算价格' : 'Recalculate Price' }}
        </button>
        <button @click="goHome" class="btn btn-secondary">
          {{ currentLanguage === 'zh' ? '返回首页' : 'Back to Home' }}
        </button>
        <button @click="contactUs" class="btn btn-outline">
          {{ currentLanguage === 'zh' ? '联系客服' : 'Contact Support' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentLanguage = ref('zh')

const goBack = () => {
  window.location.href = '/#pricing'
}

const goHome = () => {
  window.location.href = '/'
}

const contactUs = () => {
  window.location.href = '/#contact'
}
</script>

<style scoped>
.cancel-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.cancel-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.cancel-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.cancel-message {
  color: #666;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.help-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.help-section h3 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.help-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
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

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .cancel-container {
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

