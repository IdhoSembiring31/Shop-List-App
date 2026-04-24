import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";

import { products } from "./data/products";
import ProductCard from "./components/ProductCard";

const formatIDR = (price) => {
  return "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortType, setSortType] = useState("Default");
  const [isGridView, setIsGridView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // State untuk Tab

  const categories = ["Semua", ...new Set(products.map((p) => p.category))];

  const filteredData = useMemo(() => {
    let result = products.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    if (sortType === "Harga Terendah") result.sort((a, b) => a.price - b.price);
    if (sortType === "Harga Tertinggi") result.sort((a, b) => b.price - a.price);
    if (sortType === "Rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchText, selectedCategory, sortType]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // TAMPILAN DETAIL PRODUK
  if (selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedProduct(null)}
          >
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>

          <Image source={selectedProduct.image} style={styles.detailImage} />

          <View style={styles.detailInfo}>
            <Text style={styles.detailCategory}>{selectedProduct.category}</Text>
            <Text style={styles.detailName}>{selectedProduct.name}</Text>
            <Text style={styles.detailPrice}>{formatIDR(selectedProduct.price)}</Text>
            <Text style={styles.detailRating}>⭐ {selectedProduct.rating}</Text>

            <Text style={styles.descriptionHeader}>Deskripsi Produk</Text>
            <Text style={styles.descriptionBody}>
              Produk berkualitas tinggi dari kategori {selectedProduct.category}.
              Desain modern dan sangat nyaman digunakan.
            </Text>
          </View>

          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Tambah ke Keranjang</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, activeTab === "products" && styles.navButtonActive]}
            onPress={() => {
              setActiveTab("products");
              setSelectedProduct(null);
            }}
          >
            <Text style={styles.navIcon}>🛍️</Text>
            <Text style={[styles.navLabel, activeTab === "products" && styles.navLabelActive]}>
              Produk
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // TAMPILAN UTAMA (LIST)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainWrapper}>
        <View style={styles.headerArea}>
          <Text style={styles.appTitle}>🛍️ Tren-Store</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.input}
                placeholder="Cari produk favoritmu..."
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText !== "" && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsGridView(!isGridView)}
            >
              <Text style={{ fontSize: 20 }}>{isGridView ? "☰" : "▦"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterBar}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chip, selectedCategory === item && styles.activeChip]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.chipText, selectedCategory === item && styles.activeChipText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          />
        </View>

        <View style={styles.sortBar}>
          <Text style={styles.productCount}>{filteredData.length} Produk</Text>
          <View style={styles.sortOptions}>
            {["Harga Terendah", "Harga Tertinggi", "Rating"].map((type) => (
              <TouchableOpacity key={type} onPress={() => setSortType(type)}>
                <Text style={[styles.sortLink, sortType === type && styles.activeSort]}>
                  {type === "Harga Terendah" ? "Termurah" : type === "Harga Tertinggi" ? "Tertinggi" : "Rating"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          key={isGridView ? "G" : "L"}
          numColumns={isGridView ? 2 : 1}
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedProduct(item)}>
              <ProductCard item={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyText}>Produk Tidak Ditemukan</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  mainWrapper: { flex: 1, width: "100%" },
  headerArea: { padding: 20, backgroundColor: "#fff" },
  appTitle: { fontSize: 28, fontWeight: "900", color: "#0f172a", marginBottom: 15 },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 15 },
  searchIcon: { marginRight: 8, fontSize: 16 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  clearIcon: { fontSize: 18, color: "#64748b", marginLeft: 10 },
  iconButton: { marginLeft: 12, padding: 10, backgroundColor: "#f1f5f9", borderRadius: 12, width: 45, alignItems: "center" },
  filterBar: { paddingVertical: 5, backgroundColor: "#fff" },
  chip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", marginRight: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  activeChip: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  chipText: { fontWeight: "600", color: "#64748b", fontSize: 13 },
  activeChipText: { color: "#fff" },
  sortBar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15, alignItems: "center" },
  productCount: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  sortOptions: { flexDirection: "row" },
  sortLink: { marginLeft: 15, fontSize: 12, color: "#6366f1", fontWeight: "700" },
  activeSort: { textDecorationLine: "underline", color: "#0f172a" },
  listPadding: { paddingHorizontal: 10, paddingBottom: 50 },
  emptyContainer: { alignItems: "center", marginTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 50, marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#1e293b", textAlign: "center" },

  // Styles Detail
  detailContainer: { flex: 1, backgroundColor: "#fff" },
  backButton: { padding: 20, marginTop: 10 },
  backText: { fontSize: 16, color: "#6366f1", fontWeight: "bold" },
  detailImage: { width: "100%", height: 300, resizeMode: "contain" },
  detailInfo: { padding: 20 },
  detailCategory: { color: "#6366f1", fontWeight: "bold", fontSize: 14 },
  detailName: { fontSize: 24, fontWeight: "900", color: "#0f172a", marginVertical: 5 },
  detailPrice: { fontSize: 20, fontWeight: "700", color: "#10b981" },
  detailRating: { marginTop: 5, fontSize: 16 },
  descriptionHeader: { marginTop: 20, fontWeight: "bold", fontSize: 16 },
  descriptionBody: { color: "#64748b", lineHeight: 22, marginTop: 5 },
  buyButton: { backgroundColor: "#0f172a", margin: 20, padding: 18, borderRadius: 12, alignItems: "center" },
  buyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Styles Bottom Nav
  bottomNav: { flexDirection: "row", backgroundColor: "#fff", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#f1f5f9", justifyContent: "center" },
  navButton: { alignItems: "center", width: 80 },
  navButtonActive: { borderTopWidth: 2, borderTopColor: "#0f172a", paddingTop: 8 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 12, color: "#64748b", marginTop: 4 },
  navLabelActive: { color: "#0f172a", fontWeight: "bold" },
});