import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRestaurants, useCategories, useMenu } from '../src/hooks/useMenu';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useCartContext } from '../src/context/CartContext';
import { CartBar } from '../src/components/CartBar';

export default function MenuScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { getItemQty, addItem, updateQty } = useCartContext();

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
    searchQuery,
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
      // support both item.category?.name (API) and item.categoryName (mock)
      const cat = item.category?.name || item.categoryName || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return Object.entries(grouped).map(([category, data]) => ({ category, data }));
  }, [menuItems, selectedCategory]);

  // -------------------------------------------------------------------
  // Inline quantity control — shows ADD button or − qty + stepper
  // -------------------------------------------------------------------
  const renderQtyControl = (item: any) => {
    const qty = getItemQty(item.id);

    if (qty === 0) {
      return (
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => addItem(item.id, 1)}
          accessibilityLabel={`Add ${item.name} to cart`}
        >
          <Text style={[styles.addBtnText, { color: theme.primaryText }]}>ADD</Text>
          <Text style={[styles.addBtnPlus, { color: theme.primaryText }]}>+</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.qtyControl, { borderColor: theme.primary }]}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQty(item.id, qty - 1)}
          accessibilityLabel={`Decrease ${item.name} quantity`}
        >
          <Text style={[styles.qtyBtnText, { color: theme.primary }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.qtyCount, { color: theme.primary }]}>{qty}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQty(item.id, qty + 1)}
          accessibilityLabel={`Increase ${item.name} quantity`}
        >
          <Text style={[styles.qtyBtnText, { color: theme.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItemCard, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/item/${item.id}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.menuItemContent}>
        {/* Left: text info */}
        <View style={styles.menuItemInfo}>
          <Text style={[styles.menuItemName, { color: theme.text }]}>
            {item.name}{' '}
            <Text style={{ fontSize: 12 }}>
              {item.dietaryType === 'VEG' || (item.dietaryTags && item.dietaryTags[0] === 'Veg') ? '🟩' : '🟥'}
            </Text>
          </Text>
          <Text style={[styles.menuItemDesc, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.description || 'Delicious byte cafe special.'}
          </Text>
          <Text style={[styles.menuItemPrice, { color: theme.text }]}>₹{item.price}</Text>
        </View>

        {/* Right: image thumbnail + ADD/qty control */}
        <View style={styles.menuItemRight}>
          <View style={styles.itemImageWrapper}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemThumb}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.itemThumb, styles.itemThumbPlaceholder, { backgroundColor: theme.backgroundElement }]}>
                <Text style={{ fontSize: 24 }}>🍽️</Text>
              </View>
            )}
          </View>
          {/* ADD / qty stepper floats below the image */}
          <View style={styles.qtyWrapper}>
            {renderQtyControl(item)}
          </View>
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
                  !isSelected && { borderWidth: 1, borderColor: theme.border },
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
          contentContainerStyle={[styles.menuList, styles.menuListBottomPad]}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Sticky Cart Bar — overlays above the list */}
      <CartBar />
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
    marginBottom: 10,
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
  },
  // Extra bottom padding so last item isn't hidden behind the CartBar
  menuListBottomPad: {
    paddingBottom: 100,
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
    alignItems: 'flex-start',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuItemRight: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: 6,
  },
  // Thumbnail image wrapper
  itemImageWrapper: {
    width: 80,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemThumb: {
    width: 80,
    height: 72,
    borderRadius: 10,
  },
  itemThumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Container that holds ADD / stepper, centred below the image
  qtyWrapper: {
    alignItems: 'center',
  },
  // ADD button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 3,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  addBtnPlus: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: -1,
  },
  // − qty + stepper
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  qtyCount: {
    fontSize: 14,
    fontWeight: '800',
    minWidth: 22,
    textAlign: 'center',
  },
});
