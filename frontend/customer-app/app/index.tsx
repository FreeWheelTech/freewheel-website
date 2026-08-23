import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRestaurants, useCategories, useMenu } from '../src/hooks/useMenu';
import { useCart } from '../src/hooks/useCart';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useDebounce } from '../src/hooks/useDebounce';

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const { data: restaurantsData, isLoading: isRestLoading, isError: isRestError, refetch } = useRestaurants('');
  const restaurants = restaurantsData?.pages.flatMap(p => p.data) || [];

  const { data: cart } = useCart();

  if (isRestLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (isRestError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load restaurants</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}` as any)}
    >
      <View style={styles.restaurantContent}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantAddress}>{item.description}</Text>
        <Text style={styles.ratingSummary}>
          ★ {item.averageRating ? Number(item.averageRating).toFixed(1) : 'New'} ({item.reviewCount || 0} reviews)
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BYTE++ FOOD</Text>
        <View style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => router.push('/orders')}>
            <Text style={styles.cartHeaderBtn}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Text style={styles.cartHeaderBtn}>Cart {cart?.itemCount ? `(${cart.itemCount})` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.searchInputContainer} onPress={() => router.push('/search')}>
        <Text style={styles.searchPlaceholder}>🔍 Search restaurants and food...</Text>
      </TouchableOpacity>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold' },
  cartHeaderBtn: { fontSize: 16, fontWeight: 'bold', color: '#0066cc', marginTop: 8 },
  logoutText: { color: 'red', marginTop: 8 },
  restaurantInfo: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  restaurantName: { fontSize: 20, fontWeight: 'bold' },
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
  searchInputContainer: {
    margin: 16,
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#8E8E93',
  },
  restaurantCard: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  restaurantContent: { padding: 15 },
  listContainer: { paddingBottom: 20 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },
});
