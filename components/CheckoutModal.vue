<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h3 class="font-bold text-lg">Checkout</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <!-- Product Info -->
        <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img v-if="product.thumbnail" :src="getProductImage()" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold">{{ product.title }}</h4>
            <p class="text-pink-600 font-bold">{{ formatPrice(product.price) }}</p>
          </div>
        </div>

        <!-- Checkout Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Show message if no custom fields configured -->
          <div v-if="!fields || fields.length === 0" class="text-center py-4 text-gray-500">
            <p>No checkout fields configured by seller.</p>
            <p class="text-sm mt-2">Please contact seller for order details.</p>
          </div>
          
          <!-- Dynamic Custom Fields from Creator -->
          <div v-else v-for="field in fields" :key="field.name">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <!-- Text Input -->
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
              :type="field.type"
              v-model="form.custom_fields[field.name]"
              :required="field.required"
              :placeholder="field.placeholder"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            />

            <!-- Textarea -->
            <textarea
              v-if="field.type === 'textarea'"
              v-model="form.custom_fields[field.name]"
              :required="field.required"
              :placeholder="field.placeholder"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            />

            <!-- Select -->
            <select
              v-if="field.type === 'select'"
              v-model="form.custom_fields[field.name]"
              :required="field.required"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            >
              <option value="">Select...</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {{ isSubmitting ? 'Processing...' : 'Send to WhatsApp' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { success, error: showError } = useAlert();

const props = defineProps<{
  product: any;
  creator: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

const config = useRuntimeConfig();

// Use creator's custom_field
const fields = computed(() => {
  // First try creator.custom_field.fields
  if (props.creator?.custom_field?.fields) {
    return props.creator.custom_field.fields;
  }

  // Fallback to default fields
  return [
    { name: 'buyer_name', label: 'Your Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', required: false },
  ];
});

const form = ref({
  custom_fields: {} as Record<string, any>,
});

const isSubmitting = ref(false);

const getProductImage = () => {
  if (!props.product.thumbnail) return '';
  const collectionId = props.product.collectionId || '5mkjdelz8eeumqc';
  return `${config.public.pocketbaseUrl}api/files/${collectionId}/${props.product.id}/${props.product.thumbnail}`;
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateWhatsAppMessage = () => {
  // Get template from creator or use default
  const template = props.creator.whatsapp_message_template || 
    '🛒 *ORDER BARU*\n\n📦 *Product:* {product}\n💰 *Price:* {price}\n\n📋 *Details:*\n{fields}\n\n_Mohon diproses, terima kasih!_';

  // Build fields string from ALL custom fields
  let fieldsStr = '';
  if (fields.value && fields.value.length > 0) {
    fields.value.forEach((field) => {
      const value = form.value.custom_fields[field.name];
      if (value) {
        fieldsStr += `• ${field.label}: ${value}\n`;
      }
    });
  }

  // Replace variables
  let message = template
    .replace(/{product}/g, props.product.title)
    .replace(/{price}/g, formatPrice(props.product.price))
    .replace(/{fields}/g, fieldsStr || 'N/A');

  return message;
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    const pb = useNuxtApp().$pb;

    // Extract buyer_name from custom fields if exists
    const buyerName = form.value.custom_fields['buyer_name'] || form.value.custom_fields['name'] || 'Buyer';
    
    // Create order record
    const orderData = {
      creator_id: props.creator.id,
      product_id: props.product.id,
      buyer_name: buyerName,
      buyer_email: form.value.custom_fields['email'] || '',
      buyer_whatsapp: form.value.custom_fields['whatsapp'] || '',
      buyer_address: form.value.custom_fields['address'] || '',
      custom_fields: form.value.custom_fields,
      price: props.product.price,
      note: '',
      status: 'pending',
    };

    await pb.collection('orders').create(orderData);

    // Generate WhatsApp message and redirect
    const message = generateWhatsAppMessage();
    const whatsappNumber = props.creator.whatsapp?.replace(/[^0-9]/g, '') || '';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    emit('close');
    success('Order created! Please complete your payment via WhatsApp.', 'Order Created');
  } catch (err: any) {
    showError(err.message || 'Failed to create order', 'Error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
