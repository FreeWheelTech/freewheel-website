import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategories, useMenu, useUpdateAvailability, useDeleteMenuItem, useDeleteCategory } from '../../../src/hooks/useOwnerMenu';

export default function ManageMenu() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<'ITEMS' | 'CATEGORIES'>('ITEMS');

  const { data: categories, isLoading: isCatLoading } = useCategories(id as string);
  const { data: menuItems, isLoading: isMenuLoading } = useMenu(id as string);
  
  const updateAvailability = useUpdateAvailability();
  const deleteItem = useDeleteMenuItem();
  const deleteCategory = useDeleteCategory();

  if (isCatLoading || isMenuLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#000" /></View>;
  }

  const handleToggleAvailability = (itemId: string, currentVal: boolean) => {
    updateAvailability.mutate({ itemId, availability: !currentVal });
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem.mutate(itemId) },
    ]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert('Delete Category', 'Cannot delete if it has items. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory.mutate(categoryId) },
    ]);
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category?.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 10 }}>
          <Switch 
            value={item.availability} 
            onValueChange={() => handleToggleAvailability(item.id, item.availability)} 
          />
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCategory = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backButton}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Manage Menu</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'ITEMS' && styles.activeTab]} onPress={() => setTab('ITEMS')}>
          <Text style={[styles.tabText, tab === 'ITEMS' && styles.activeTabText]}>Menu Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'CATEGORIES' && styles.activeTab]} onPress={() => setTab('CATEGORIES')}>
          <Text style={[styles.tabText, tab === 'CATEGORIES' && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>

      {tab === 'ITEMS' ? (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No menu items found.</Text>}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#333', gap: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: { fontSize: 16, color: '#fff' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#000' },
  tabText: { fontSize: 16, color: 'gray', fontWeight: 'bold' },
  activeTabText: { color: '#000' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemCategory: { fontSize: 14, color: 'gray', marginTop: 2 },
  itemPrice: { fontSize: 16, marginTop: 5 },
  deleteText: { color: 'red', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: 'gray' },
});
