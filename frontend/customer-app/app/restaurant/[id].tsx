import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategories, useMenu, useRestaurants } from '../../src/hooks/useMenu';
import { useDebounce } from '../../src/hooks/useDebounce';

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data: restaurantsData } = useRestaurants('');
  const restaurant = restaurantsData?.pages.flatMap(p => p.data).find((r: any) => r.id === id);

  const { data: categories, isLoading: isCatLoading } = useCategories(id as string);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError, refetch } = useMenu(id as string, selectedCategory, debouncedSearch);
  const menuItems = menuData?.pages.flatMap(p => p.data) || [];

  if (isCatLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (isMenuError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load menu</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCategory = ({ item }: { item: { id: string, name: string } }) => (
    <TouchableOpacity 
      style={[styles.categoryPill, selectedCategory === item.name && styles.categoryPillSelected]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text style={[styles.categoryText, selectedCategory === item.name && styles.categoryTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.menuItem, !item.availability && styles.menuItemUnavailable]}
      onPress={() => item.availability && router.push(`/item/${item.id}` as any)}
      disabled={!item.availability}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        {item.dietaryType && (
          <Text style={[styles.dietaryIcon, item.dietaryType === 'VEG' ? styles.veg : styles.nonVeg]}>
            {item.dietaryType === 'VEG' ? '🟢 Veg' : item.dietaryType === 'EGG' ? '🟡 Egg' : '🔴 Non-Veg'}
          </Text>
        )}
        {!item.availability && <Text style={styles.unavailableText}>Currently Unavailable</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {restaurant && (
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          <TouchableOpacity onPress={() => router.push(`/restaurant/${restaurant.id}/reviews`)}>
            <Text style={styles.ratingSummary}>
              ★ {restaurant.averageRating ? Number(restaurant.averageRating).toFixed(1) : 'New'} ({restaurant.reviewCount || 0} reviews)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={[{ id: 'all', name: 'All' }, ...(categories || [])]}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {isMenuLoading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={menuItems || []}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.menuList}
          ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restaurantInfo: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  restaurantName: { fontSize: 24, fontWeight: 'bold' },
  restaurantAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  ratingSummary: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 8,
    fontWeight: 'bold',
  },
  categoriesContainer: { height: 60, marginTop: 10 },
  categoriesList: { paddingHorizontal: 15 },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#ddd', marginRight: 10, justifyContent: 'center' },
  categoryPillSelected: { backgroundColor: '#FFD700' },
  categoryText: { fontWeight: '600', color: '#555' },
  categoryTextSelected: { color: '#000' },
  menuList: { padding: 15 },
  menuItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  menuItemUnavailable: { opacity: 0.5 },
  menuItemContent: { gap: 4 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, color: '#444' },
  dietaryIcon: { fontSize: 12, fontWeight: 'bold' },
  veg: { color: 'green' },
  nonVeg: { color: 'red' },
  unavailableText: { color: 'red', fontWeight: 'bold', marginTop: 4 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },
});
