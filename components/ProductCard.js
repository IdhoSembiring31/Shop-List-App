// File: components/ProductCard.js
import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";

const ProductCard = ({ item, onPress }) => {
  
  const scaleValue = useRef(new Animated.Value(1)).current;


  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

 
  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <TouchableOpacity
      activeOpacity={1} 
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(item)} 
      style={styles.touchable}
    >
      
      <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <View style={styles.badgeContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.categoryTag} numberOfLines={1}>
            {item.category}
          </Text>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.footer}>
            <Text
              style={styles.priceText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {formatRupiah(item.price)}
            </Text>
            <View style={styles.addButton}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    margin: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flex: 1,
    maxHeight: Platform.OS === "web" ? "100%" : "100%",
    maxWidth: Platform.OS === "web" ? "80%" : "100%",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    color: "#F59E0B",
    fontSize: 10,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  details: {
    padding: 12,
  },
  categoryTag: {
    fontSize: 9,
    fontWeight: "800",
    color: "#6366F1",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#10B981",
    flex: 1,
  },
  addButton: {
    backgroundColor: "#0F172A",
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductCard;