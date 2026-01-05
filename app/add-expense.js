import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addExpense } from '../utils/storage';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'];

export default function AddExpenseScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState({ name: 'Food', icon: 'fast-food' }); // Default
    const [note, setNote] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
            return;
        }

        try {
            setIsSaving(true);

            // Format date string as YYYY-MM-DD for simple consistency
            const now = new Date();
            const formattedDate = now.toISOString().split('T')[0];

            const newExpense = {
                amount: parseFloat(amount),
                category: category.name,
                note: note.trim(),
                date: formattedDate, // YYYY-MM-DD
                fullDate: now.toISOString(), // Full timestamp for sorting
            };

            await addExpense(newExpense);
            setIsSaving(false);
            router.back(); // Close modal
        } catch (error) {
            console.error(error);
            setIsSaving(false);
            Alert.alert('Error', 'Failed to save expense. Please check your connection.');
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header (Close Button) */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Expense</Text>
                        {/* Native modal gesture usually handles close, but explicit close is nice */}
                    </View>

                    {/* Amount Input */}
                    <Text style={styles.label}>Amount ($)</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />

                    {/* Category Selection */}
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryContainer}>
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    category.name === cat && styles.categoryChipSelected
                                ]}
                                onPress={() => setCategory({ name: cat })}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    category.name === cat && styles.categoryTextSelected
                                ]}>{cat}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Note Input (Optional) */}
                    <Text style={styles.label}>Note (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What did you buy?"
                        value={note}
                        onChangeText={setNote}
                    />

                    {/* Date Info */}
                    <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>

                    {/* Save Button */}
                    <Pressable
                        style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Expense'}</Text>
                    </Pressable>

                    <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        color: '#333',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 24,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    categoryChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryChipSelected: {
        backgroundColor: '#e7f5ff',
        borderColor: '#007AFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#495057',
    },
    categoryTextSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    dateText: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 24,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 16,
    },
});
