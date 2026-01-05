import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';
import FilterSection from '../components/FilterSection';
import { getExpenses, removeExpense } from '../utils/storage';

export default function HomeScreen() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterDate, setFilterDate] = useState('All');

    const loadExpenses = async () => {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data);
        setLoading(false);
    };

    // Reload expenses when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadExpenses();
        }, [])
    );

    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        try {
            setDeletingId(id);
            console.log('Deleting expense:', id);
            const updated = await removeExpense(id);
            setExpenses(updated);
            Alert.alert('Success', 'Expense deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Error', 'Failed to delete expense');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredExpenses = useMemo(() => {
        let result = expenses;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(item => item.category === selectedCategory);
        }

        // Filter by Date
        const now = new Date();
        if (filterDate === 'This Month') {
            result = result.filter(item => {
                const d = new Date(item.fullDate);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (filterDate === 'Last Month') {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            result = result.filter(item => {
                const d = new Date(item.fullDate);
                return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
            });
        }

        return result;
    }, [expenses, selectedCategory, filterDate]);

    const totalSpending = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
    }, [filteredExpenses]);

    return (
        <View style={styles.container}>
            {/* Header with Total */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Total Spent</Text>
                <Text style={styles.totalAmount}>${totalSpending}</Text>
            </View>

            {/* Filters */}
            <FilterSection
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDateRange={filterDate}
                onSelectDateRange={setFilterDate}
            />

            {/* List */}
            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={filteredExpenses}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ExpenseCard
                                item={item}
                                onDelete={handleDelete}
                                isDeleting={deletingId === item.id}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={styles.emptyText}>No expenses found.</Text>
                                <Pressable onPress={loadExpenses} style={{ padding: 10 }}>
                                    <Text style={{ color: '#007AFF' }}>Tap to Reload</Text>
                                </Pressable>
                            </View>
                        }
                        refreshing={loading}
                        onRefresh={loadExpenses}
                    />
                )}
            </View>

            {/* Add Button (Floating) */}
            <Link href="/add-expense" asChild>
                <Pressable style={styles.fab}>
                    <Ionicons name="add" size={32} color="white" />
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF', // Primary Blue
        padding: 24,
        paddingTop: 60, // Safe area
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        marginBottom: 4,
    },
    totalAmount: {
        color: 'white',
        fontSize: 40,
        fontWeight: '800',
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // Space for FAB
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
