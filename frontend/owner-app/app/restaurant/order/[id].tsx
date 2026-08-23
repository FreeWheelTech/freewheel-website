import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOwnerOrder, useUpdateOrderStatus } from '../../../src/hooks/useOwnerOrders';

export default function OwnerOrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOwnerOrder(id as string);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load order details.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.retryButton, { marginTop: 10, backgroundColor: '#eee' }]} onPress={() => router.back()}><Text>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    Alert.alert('Confirm', `Mark this order as ${newStatus}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Confirm', 
        onPress: () => {
          updateStatus.mutate({ orderId: order.id, status: newStatus }, {
            onSuccess: () => Alert.alert('Success', `Order marked as ${newStatus}`),
            onError: (err: any) => Alert.alert('Error', err.response?.data?.message || 'Failed to update status')
          });
        }
      }
    ]);
  };

  const isUpdating = updateStatus.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isUpdating}><Text style={[styles.headerBack, isUpdating && {color: '#ccc'}]}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderIdTitle}>Order #{order.id.substring(0, 8)}</Text>
            <Text style={[styles.statusBadge, styles[`status${order.status}` as keyof typeof styles] || styles.statusDefault]}>{order.status}</Text>
          </View>
          <Text style={styles.dateText}>{new Date(order.createdAt).toLocaleString()}</Text>
          
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>Payment: {order.payment?.status || 'UNPAID'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.infoText}>{order.customerProfile.user.name}</Text>
          <Text style={styles.infoText}>{order.customerProfile.user.phone || 'No phone provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemName}>{item.quantity} × {item.nameSnapshot}</Text>
                <Text style={styles.itemPrice}>₹{item.lineTotal}</Text>
              </View>
              {item.addons.length > 0 && (
                <View style={styles.addonsList}>
                  {item.addons.map((a: any) => (
                    <Text key={a.id} style={styles.addonText}>+ {a.nameSnapshot} (₹{a.priceSnapshot})</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          {order.status === 'PENDING' && (
            <>
              <TouchableOpacity style={[styles.actionBtn, styles.btnConfirm]} onPress={() => handleStatusChange('CONFIRMED')} disabled={isUpdating}>
                <Text style={styles.btnTextLight}>Confirm Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnCancel]} onPress={() => handleStatusChange('CANCELLED')} disabled={isUpdating}>
                <Text style={styles.btnTextLight}>Cancel Order</Text>
              </TouchableOpacity>
            </>
          )}
          
          {order.status === 'CONFIRMED' && (
            <>
              <TouchableOpacity style={[styles.actionBtn, styles.btnPrepare]} onPress={() => handleStatusChange('PREPARING')} disabled={isUpdating}>
                <Text style={styles.btnTextDark}>Start Preparing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnCancel]} onPress={() => handleStatusChange('CANCELLED')} disabled={isUpdating}>
                <Text style={styles.btnTextLight}>Cancel Order</Text>
              </TouchableOpacity>
            </>
          )}

          {order.status === 'PREPARING' && (
            <TouchableOpacity style={[styles.actionBtn, styles.btnReady]} onPress={() => handleStatusChange('READY')} disabled={isUpdating}>
              <Text style={styles.btnTextDark}>Mark as Ready</Text>
            </TouchableOpacity>
          )}

          {order.status === 'READY' && (
            <TouchableOpacity style={[styles.actionBtn, styles.btnComplete]} onPress={() => handleStatusChange('COMPLETED')} disabled={isUpdating}>
              <Text style={styles.btnTextLight}>Complete Order</Text>
            </TouchableOpacity>
          )}

          {['COMPLETED', 'CANCELLED', 'REJECTED'].includes(order.status) && (
            <Text style={styles.terminalStateMsg}>This order is {order.status.toLowerCase()} and cannot be modified.</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerBack: { fontSize: 16, color: '#0066cc' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 1 },
  orderHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  orderIdTitle: { fontSize: 18, fontWeight: 'bold' },
  dateText: { fontSize: 14, color: 'gray', marginBottom: 10 },
  paymentBadge: { backgroundColor: '#e6f7ff', padding: 10, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#91d5ff' },
  paymentText: { fontWeight: 'bold', color: '#0050b3' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#555' },
  infoText: { fontSize: 16, color: '#333', marginBottom: 5 },
  itemRow: { marginBottom: 15 },
  itemMain: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  addonsList: { marginTop: 4, marginLeft: 10 },
  addonText: { fontSize: 14, color: 'gray' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold' },
  actionsSection: { padding: 10, paddingBottom: 40 },
  actionBtn: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnConfirm: { backgroundColor: '#1890ff' },
  btnPrepare: { backgroundColor: '#FFD700' },
  btnReady: { backgroundColor: '#52c41a' },
  btnComplete: { backgroundColor: '#000' },
  btnCancel: { backgroundColor: '#ff4d4f' },
  btnTextLight: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnTextDark: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  terminalStateMsg: { textAlign: 'center', color: 'gray', fontSize: 14, marginTop: 10, fontStyle: 'italic' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5, paddingHorizontal: 20 },
  retryText: { fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontSize: 12, fontWeight: 'bold' },
  statusDefault: { backgroundColor: '#eee', color: '#333' },
  statusPENDING: { backgroundColor: '#fff3cd', color: '#856404' },
  statusCONFIRMED: { backgroundColor: '#cce5ff', color: '#004085' },
  statusPREPARING: { backgroundColor: '#ffeeba', color: '#856404' },
  statusREADY: { backgroundColor: '#d4edda', color: '#155724' },
  statusCOMPLETED: { backgroundColor: '#e2e3e5', color: '#383d41' },
  statusCANCELLED: { backgroundColor: '#f8d7da', color: '#721c24' },
});
