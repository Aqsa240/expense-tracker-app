import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

// Map categories to icons
const getCategoryIcon = (category) => {
    switch (category) {
        case 'Food': return 'fast-food';
        case 'Transport': return 'car';
        case 'Shopping': return 'cart';
        case 'Entertainment': return 'film';
        case 'Health': return 'medkit';
        default: return 'ellipsis-horizontal-circle';
    }
};

const getCategoryColor = (category) => {
    switch (category) {
        case 'Food': return '#FF6B6B'; // Red/Orange
        case 'Transport': return '#4ECDC4'; // Teal
        case 'Shopping': return '#FFE66D'; // Yellow
        case 'Entertainment': return '#9D65C9'; // Purple
        case 'Health': return '#FF9F1C'; // Orange
        default: return '#A8A8A8'; // Gray
    }
};

const ExpenseCard = ({ item, onDelete, isDeleting }) => {
    const handleDelete = () => {
        console.log("Trash icon pressed for item:", item.id);
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) }
            ]
        );
    };

    return (
        <View style={[styles.card, isDeleting && { opacity: 0.5 }]}>
            <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) }]}>
                <Ionicons name={getCategoryIcon(item.category)} size={24} color="white" />
            </View>

            <View style={styles.details}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>

            <View style={styles.rightSection}>
                <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
                <Pressable
                    onPress={handleDelete}
                    style={styles.deleteButton}
                    disabled={isDeleting}
                    hitSlop={10} // Easier to tap
                >
                    {isDeleting ? (
                        <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" /> // Sligtly larger icon
                    )}
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    deleteButton: {
        padding: 12, // Larger touch area
        marginLeft: 8,
    },
});

export default ExpenseCard;
