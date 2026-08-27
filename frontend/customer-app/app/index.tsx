import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useRestaurants, useCategories, useMenu } from '../src/hooks/useMenu';
import { useCart } from '../src/hooks/useCart';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function MenuScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch the first restaurant (BYTE CAFE)
  const { data: restaurantsData, isLoading: isRestLoading } = useRestaurants('');
  const restaurantId = restaurantsData?.pages[0]?.data?.[0]?.id;

  const { data: categoriesData } = useCategories(restaurantId);
  const categories = [{ name: 'All', id: 'all' }, ...(categoriesData || [])];

  const { data: menuData, isLoading: isMenuLoading, fetchNextPage, hasNextPage } = useMenu(
    restaurantId, 
    selectedCategory === 'All' ? undefined : selectedCategory, 
    searchQuery
  );
  
  const menuItems = useMemo(() => {
    return menuData?.pages.flatMap(p => p.data) || [];
  }, [menuData]);

  const groupedMenu = useMemo(() => {
    if (selectedCategory !== 'All') {
      return [{ category: selectedCategory, data: menuItems }];
    }
    const grouped: Record<string, any[]> = {};
    menuItems.forEach(item => {
      const cat = item.category?.name || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return Object.entries(grouped).map(([category, data]) => ({ category, data }));
  }, [menuItems, selectedCategory]);

  const renderMenuItem = (item: any) => (
    <TouchableOpacity 
      key={item.id}
      style={[styles.menuItemCard, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/item/${item.id}` as any)}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemInfo}>
          <Text style={[styles.menuItemName, { color: theme.text }]}>
            {item.name} {item.dietaryType === 'VEG' ? '🟩' : '🟥'}
          </Text>
          <Text style={[styles.menuItemDesc, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.description || 'Delicious byte cafe special.'}
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemPrice, { color: theme.text }]}>₹{item.price}</Text>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.addBtnText, { color: theme.primaryText }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isRestLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={{ fontSize: 24, color: theme.text }}>≡</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>BYTE++ Café</Text>
          <Text style={[styles.headerSub, { color: theme.primary }]}>CODE • EAT • REPEAT</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Text style={{ fontSize: 24, color: theme.text }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.screenTitle, { color: theme.text }]}>Menu</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.backgroundElement }]}>
          <Text style={{ marginRight: 8 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search for items..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={{ color: theme.text }}>⚡ Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c.id || c.name}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.name;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  { backgroundColor: isSelected ? theme.accent : theme.backgroundElement },
                  !isSelected && { borderWidth: 1, borderColor: theme.border }
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Text style={{ color: isSelected ? '#FFFFFF' : theme.text, fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Menu Items */}
      {isMenuLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={groupedMenu}
          keyExtractor={(item) => item.category}
          renderItem={({ item: group }) => (
            <View style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: theme.text }]}>{group.category}</Text>
                <TouchableOpacity>
                  <Text style={[styles.viewAll, { color: theme.accent }]}>View All →</Text>
                </TouchableOpacity>
              </View>
              {group.data.map(renderMenuItem)}
            </View>
          )}
          contentContainerStyle={styles.menuList}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingTop: 10,
    marginBottom: 10
  },
  headerTitles: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900' },
  headerSub: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    height: 48,
    borderWidth: 1,
  },
  categoriesWrapper: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  }
});
