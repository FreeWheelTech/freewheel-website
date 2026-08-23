import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalMenuSearch } from '../src/hooks/useMenu';
import { useDebounce } from '../src/hooks/useDebounce';

export default function SearchScreen() {
  const router = useRouter();
  
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    dietaryType: '',
    minPrice: '',
    maxPrice: '',
    sort: 'name_asc'
  });

  // Query uses debounced search and current filters
  const { 
    data: menuData, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useGlobalMenuSearch({
    q: debouncedSearch,
    category: filters.category,
    dietaryType: filters.dietaryType,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort
  });

  const menuItems = menuData?.pages.flatMap(page => page.data) || [];

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.menuItem, !item.availability && styles.menuItemUnavailable]}
      onPress={() => item.availability && router.push(`/item/${item.id}` as any)}
      disabled={!item.availability}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.restaurantName}>{item.category?.restaurant?.name}</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search Food</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterButton}>Filters</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for 'chicken', 'burger'..."
        value={search}
        onChangeText={setSearch}
      />

      {isLoading && !menuItems.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load results.</Text>
        </View>
      ) : menuItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No food found</Text>
          <Text style={styles.emptySubText}>Try another search or clear filters.</Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.listContent}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator size="small" color="#FFD700" style={{ marginVertical: 16 }} /> : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Dietary */}
            <Text style={styles.filterSectionTitle}>Dietary Preference</Text>
            <View style={styles.filterRow}>
              {['', 'VEG', 'NON_VEG', 'EGG'].map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.filterPill, filters.dietaryType === type && styles.filterPillActive]}
                  onPress={() => setFilters({ ...filters, dietaryType: type })}
                >
                  <Text style={[styles.filterPillText, filters.dietaryType === type && styles.filterPillTextActive]}>
                    {type === '' ? 'Any' : type.replace('_', '-')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <Text style={styles.filterSectionTitle}>Price Range (₹)</Text>
            <View style={styles.priceRow}>
              <TextInput 
                style={styles.priceInput} 
                placeholder="Min" 
                keyboardType="numeric"
                value={filters.minPrice}
                onChangeText={v => setFilters({ ...filters, minPrice: v })}
              />
              <Text> - </Text>
              <TextInput 
                style={styles.priceInput} 
                placeholder="Max" 
                keyboardType="numeric"
                value={filters.maxPrice}
                onChangeText={v => setFilters({ ...filters, maxPrice: v })}
              />
            </View>

            {/* Sort */}
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterRow}>
              {[
                { label: 'Name (A-Z)', value: 'name_asc' },
                { label: 'Name (Z-A)', value: 'name_desc' },
                { label: 'Price (Low to High)', value: 'price_asc' },
                { label: 'Price (High to Low)', value: 'price_desc' }
              ].map(sortOption => (
                <TouchableOpacity 
                  key={sortOption.value} 
                  style={[styles.sortCard, filters.sort === sortOption.value && styles.sortCardActive]}
                  onPress={() => setFilters({ ...filters, sort: sortOption.value })}
                >
                  <Text style={[styles.sortText, filters.sort === sortOption.value && styles.sortTextActive]}>
                    {sortOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={() => handleApplyFilters(filters)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => handleApplyFilters({ category: 'All', dietaryType: '', minPrice: '', maxPrice: '', sort: 'name_asc' })}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFFFFF' },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 20, fontWeight: '700' },
  filterButton: { fontSize: 16, color: '#FF3B30' },
  searchInput: { margin: 16, padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#8E8E93' },
  errorText: { fontSize: 16, color: '#FF3B30' },
  listContent: { padding: 16 },
  menuItem: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  menuItemUnavailable: { opacity: 0.5 },
  menuItemContent: { gap: 4 },
  restaurantName: { fontSize: 12, color: '#8E8E93', fontWeight: '600', textTransform: 'uppercase' },
  itemName: { fontSize: 18, fontWeight: '700', color: '#000000' },
  itemPrice: { fontSize: 16, color: '#34C759', fontWeight: '600' },
  dietaryIcon: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  veg: { color: '#34C759' },
  nonVeg: { color: '#FF3B30' },
  unavailableText: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#F2F2F7', paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { fontSize: 16, color: '#007AFF' },
  modalContent: { padding: 16 },
  filterSectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#8E8E93' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E5EA' },
  filterPillActive: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
  filterPillText: { color: '#1C1C1E', fontWeight: '500' },
  filterPillTextActive: { color: '#FFFFFF' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceInput: { flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  sortCard: { width: '100%', padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  sortCardActive: { borderColor: '#FF3B30', backgroundColor: '#FFF0F0' },
  sortText: { fontSize: 16, color: '#1C1C1E' },
  sortTextActive: { color: '#FF3B30', fontWeight: '600' },
  applyButton: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  applyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  clearButton: { padding: 16, alignItems: 'center', marginTop: 8 },
  clearButtonText: { color: '#007AFF', fontSize: 16 },
});
