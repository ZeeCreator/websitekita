<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Creator Links</h1>
        <p class="text-white/90 text-lg">Temukan link menarik dari creator favoritmu</p>
      </div>
    </section>

    <!-- Links List -->
    <div class="max-w-4xl mx-auto px-4 py-8 flex-1">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>

      <div v-else-if="allLinks.length === 0" class="text-center py-12 text-gray-500">
        <p>Belum ada link yang tersedia</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in allLinks"
          :key="item.link.id"
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <a
                :href="item.link.url"
                target="_blank"
                class="block"
              >
                <h3 class="font-semibold text-gray-900 text-lg">{{ item.link.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">by {{ item.creator.name }}</p>
              </a>
            </div>
            <a
              :href="item.link.url"
              target="_blank"
              class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Kunjungi
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
interface LinkWithCreator {
  link: {
    id: string;
    title: string;
    url: string;
    order?: number;
  };
  creator: {
    id: string;
    name: string;
    username: string;
  };
}

const allLinks = ref<LinkWithCreator[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const pb = useNuxtApp().$pb;

    // Fetch all active links with creator info
    const links = await pb.collection('links').getFullList({
      filter: 'is_active = true',
      sort: 'order',
    });

    // Get creator info for each link
    for (const link of links) {
      const creator = await pb.collection('users').getOne(link.creator_id);
      allLinks.value.push({
        link: {
          id: link.id,
          title: link.title,
          url: link.url,
          order: link.order,
        },
        creator: {
          id: creator.id,
          name: creator.name,
          username: creator.username,
        },
      });
    }
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: 'Creator Links | WebsiteKita',
});
</script>
