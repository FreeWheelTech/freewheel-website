import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategories, useMenu, useRestaurants } from '../../src/hooks/useMenu';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
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
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isMenuError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Unable to load menu</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const renderCategory = ({ item }: { item: { id: string, name: string } }) => (
    <TouchableOpacity 
      style={[
        styles.categoryPill, 
        { backgroundColor: theme.backgroundElement },
        selectedCategory === item.name && { backgroundColor: theme.accent }
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text style={[
        styles.categoryText, 
        { color: theme.text },
        selectedCategory === item.name && { color: '#000000', fontWeight: 'bold' }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { backgroundColor: theme.card },
        !item.availability && { opacity: 0.5 }
      ]}
      onPress={() => item.availability && router.push(`/item/${item.id}` as any)}
      disabled={!item.availability}
    >
      <View style={styles.menuItemContent}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: theme.success }]}>₹{item.price}</Text>
        {item.dietaryType && (
          <Text style={[
            styles.dietaryIcon, 
            item.dietaryType === 'VEG' ? { color: theme.success } : item.dietaryType === 'EGG' ? { color: theme.warning } : { color: theme.error }
          ]}>
            {item.dietaryType === 'VEG' ? '🟢 Veg' : item.dietaryType === 'EGG' ? '🟡 Egg' : '🔴 Non-Veg'}
          </Text>
        )}
        {!item.availability && <Text style={[styles.unavailableText, { color: theme.error }]}>Currently Unavailable</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Menu</Text>
        <View style={{ width: 40 }} />
      </View>

      {restaurant && (
        <View style={[styles.restaurantInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.restaurantName, { color: theme.text }]}>{restaurant.name}</Text>
          <Text style={[styles.restaurantAddress, { color: theme.textSecondary }]}>{restaurant.address}</Text>
          <TouchableOpacity onPress={() => router.push(`/restaurant/${restaurant.id}/reviews`)}>
            <Text style={[styles.ratingSummary, { color: theme.accent }]}>
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
        <ActivityIndicator size="large" color={theme.accent} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={menuItems || []}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.menuList}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No items found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restaurantInfo: { padding: 20, borderBottomWidth: 1 },
  restaurantName: { fontSize: 24, fontWeight: 'bold' },
  restaurantAddress: { fontSize: 14, marginTop: 5 },
  ratingSummary: { fontSize: 16, marginTop: 8, fontWeight: 'bold' },
  categoriesContainer: { height: 60, marginTop: 16 },
  categoriesList: { paddingHorizontal: 16, alignItems: 'center' },
  categoryPill: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginRight: 12, justifyContent: 'center' },
  categoryText: { fontWeight: '600', fontSize: 16 },
  menuList: { padding: 16 },
  menuItem: { padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  menuItemContent: { gap: 4 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  dietaryIcon: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  unavailableText: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  errorText: { fontSize: 18, marginBottom: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
