import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalMenuSearch } from '../src/hooks/useMenu';
import { useDebounce } from '../src/hooks/useDebounce';
import { useTheme } from '@/hooks/use-theme';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  
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
      style={[
        styles.menuItem, 
        { backgroundColor: theme.card },
        !item.availability && { opacity: 0.5 }
      ]}
      onPress={() => item.availability && router.push(`/item/${item.id}` as any)}
      disabled={!item.availability}
    >
      <View style={styles.menuItemContent}>
        <Text style={[styles.restaurantName, { color: theme.textSecondary }]}>{item.category?.restaurant?.name}</Text>
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
        <Text style={[styles.title, { color: theme.text }]}>Search</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Text style={[styles.filterButton, { color: theme.accent }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <TextInput
          placeholder="Search for 'burger', 'roll'..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading && !menuItems.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>Unable to load results.</Text>
        </View>
      ) : menuItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No food found</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Try another search or clear filters.</Text>
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
            isFetchingNextPage ? <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 16 }} /> : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Text style={{ fontSize: 16, color: theme.textSecondary }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Dietary */}
            <Text style={[styles.filterSectionTitle, { color: theme.textSecondary }]}>Dietary Preference</Text>
            <View style={styles.filterRow}>
              {['', 'VEG', 'NON_VEG', 'EGG'].map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[
                    styles.filterPill, 
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    filters.dietaryType === type && { backgroundColor: theme.accent, borderColor: theme.accent }
                  ]}
                  onPress={() => setFilters({ ...filters, dietaryType: type })}
                >
                  <Text style={[
                    styles.filterPillText, 
                    { color: theme.text },
                    filters.dietaryType === type && { color: '#FFFFFF' }
                  ]}>
                    {type === '' ? 'Any' : type.replace('_', '-')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <Text style={[styles.filterSectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>Price Range (₹)</Text>
            <View style={styles.priceRow}>
              <View style={{ flex: 1 }}>
                <TextInput 
                  placeholder="Min" 
                  keyboardType="numeric"
                  value={filters.minPrice}
                  onChangeText={v => setFilters({ ...filters, minPrice: v })}
                />
              </View>
              <Text style={{ marginHorizontal: 8, color: theme.text }}>-</Text>
              <View style={{ flex: 1 }}>
                <TextInput 
                  placeholder="Max" 
                  keyboardType="numeric"
                  value={filters.maxPrice}
                  onChangeText={v => setFilters({ ...filters, maxPrice: v })}
                />
              </View>
            </View>

            {/* Sort */}
            <Text style={[styles.filterSectionTitle, { color: theme.textSecondary, marginTop: 16 }]}>Sort By</Text>
            <View style={styles.filterRow}>
              {[
                { label: 'Name (A-Z)', value: 'name_asc' },
                { label: 'Name (Z-A)', value: 'name_desc' },
                { label: 'Price (Low to High)', value: 'price_asc' },
                { label: 'Price (High to Low)', value: 'price_desc' }
              ].map(sortOption => (
                <TouchableOpacity 
                  key={sortOption.value} 
                  style={[
                    styles.sortCard, 
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    filters.sort === sortOption.value && { borderColor: theme.accent, backgroundColor: theme.accent + '20' }
                  ]}
                  onPress={() => setFilters({ ...filters, sort: sortOption.value })}
                >
                  <Text style={[
                    styles.sortText, 
                    { color: theme.text },
                    filters.sort === sortOption.value && { color: theme.accent, fontWeight: 'bold' }
                  ]}>
                    {sortOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Apply Filters" onPress={() => handleApplyFilters(filters)} style={{ marginTop: 24 }} />
            
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => handleApplyFilters({ category: 'All', dietaryType: '', minPrice: '', maxPrice: '', sort: 'name_asc' })}
            >
              <Text style={[styles.clearButtonText, { color: theme.textSecondary }]}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  title: { fontSize: 20, fontWeight: 'bold' },
  filterButton: { fontSize: 16, fontWeight: '600' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubText: { fontSize: 14 },
  errorText: { fontSize: 16 },
  listContent: { padding: 16 },
  menuItem: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2 
  },
  menuItemContent: { gap: 4 },
  restaurantName: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  dietaryIcon: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  unavailableText: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  
  // Modal styles
  modalContainer: { flex: 1, paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalContent: { padding: 16 },
  filterSectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  filterPillText: { fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sortCard: { width: '100%', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  sortText: { fontSize: 16 },
  clearButton: { padding: 16, alignItems: 'center', marginTop: 8 },
  clearButtonText: { fontSize: 16, fontWeight: 'bold' },
});
