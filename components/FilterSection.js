import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'];
const DATE_RANGES = ['All', 'This Month', 'Last Month'];

const FilterSection = ({ selectedCategory, onSelectCategory, selectedDateRange, onSelectDateRange }) => {

    const FilterChip = ({ label, selected, onPress }) => (
        <Pressable
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {label}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Filter by Date</Text>
            <View style={styles.row}>
                {DATE_RANGES.map((range) => (
                    <FilterChip
                        key={range}
                        label={range}
                        selected={selectedDateRange === range}
                        onPress={() => onSelectDateRange(range)}
                    />
                ))}
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Filter by Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                {CATEGORIES.map((cat) => (
                    <FilterChip
                        key={cat}
                        label={cat}
                        selected={selectedCategory === cat}
                        onPress={() => onSelectCategory(cat)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginLeft: 16,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
    },
    scrollRow: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipSelected: {
        backgroundColor: '#e7f5ff', // Light Blue
        borderColor: '#007AFF',
    },
    chipText: {
        fontSize: 14,
        color: '#495057',
    },
    chipTextSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default FilterSection;
