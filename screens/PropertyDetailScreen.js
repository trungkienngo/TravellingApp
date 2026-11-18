
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";

import { getPlaceById } from "../data/places";

// Images
import backIcon from "../assets/backIcon.png";
import locationIcon from "../assets/location.png";
import star from "../assets/star.png";
import next from "../assets/next.png";
import Internet from "../assets/Internet.png";
import Kitchen from "../assets/Kitchen.png";
import Pool from "../assets/Pool.png";
import Outdoor from "../assets/Outdoor.png";
import Clock from "../assets/Clock.png";

export default function PropertyDetailScreen({
  route,
  navigation,
}) {
  const params = route?.params || {};

  const {
    placeId,
    startDay = null,
    endDay = null,
    guests = 1,
    child = 0,
  } = params;

  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [imageWidth, setImageWidth] = useState(
    Dimensions.get("window").width
  );

  // =====================================
  // LẤY THÔNG TIN PHÒNG TỪ DỮ LIỆU MẪU
  // =====================================
  useEffect(() => {
    let active = true;

    const fetchPlaceData = async () => {
      try {
        const place = getPlaceById(placeId);

        if (!active) return;

        if (place) {
          setPlaceData(place);
        } else {
          console.error(
            "Không tìm thấy địa điểm:",
            placeId
          );

          if (Platform.OS === "web") {
            window.alert("Không tìm thấy địa điểm");
          } else {
            Alert.alert(
              "Lỗi",
              "Không tìm thấy địa điểm"
            );
          }

          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }
      } catch (error) {
        console.error(
          "Error fetching place data:",
          error
        );

        if (active && navigation.canGoBack()) {
          navigation.goBack();
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPlaceData();

    return () => {
      active = false;
    };
  }, [placeId, navigation]);

  // =====================================
  // CÁC HÀM XỬ LÝ
  // =====================================

  const limitWords = (value, limit) => {
    const words = String(value || "").split(" ");

    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }

    return words.join(" ");
  };

  const openMap = (item) => {
    const latitude = parseFloat(
      item?.Cord?.latitude
    );

    const longitude = parseFloat(
      item?.Cord?.longitude
    );

    navigation.navigate("MapScreen", {
      item,
      latitude,
      longitude,
    });
  };

  const handleScroll = (event) => {
    const offset =
      event.nativeEvent.contentOffset.x;

    const index = Math.round(
      offset / Math.max(imageWidth, 1)
    );

    setCurrentImageIndex(index);
  };

  // =====================================
  // XỬ LÝ ĐẶT PHÒNG
  // =====================================
  const handleBookNow = () => {
    if (!placeData) {
      return;
    }

    navigation.navigate("ComfirmAndPay", {
      item: placeData,
      placeId: placeData.id,
      startDay,
      endDay,
      guests,
      child,
    });
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#00bcd5"
        />

        <Text style={styles.loadingText}>
          Đang tải thông tin phòng...
        </Text>
      </View>
    );
  }

  if (!placeData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>
          Không tìm thấy thông tin phòng.
        </Text>
      </View>
    );
  }

  const place = placeData.Place || {};
  const address = placeData.Address || {};
  const facilities = placeData.Facilities || {};
  const room = placeData.Room || {};
  const policies = placeData.Policies || {};

  const images = Array.isArray(place.img)
    ? place.img
    : place.img
      ? [place.img]
      : [];

  const price = place.price ?? 0;

  // =====================================
  // GIAO DIỆN
  // =====================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      {/* NỘI DUNG CUỘN */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE SLIDER */}
        <View
          style={styles.imageContainer}
          onLayout={(event) => {
            setImageWidth(
              event.nativeEvent.layout.width
            );
          }}
        >
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              index.toString()
            }
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[
                  styles.img,
                  { width: imageWidth },
                ]}
              />
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {/* SỐ LƯỢNG ẢNH */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {images.length > 0
                ? currentImageIndex + 1
                : 0}
              /{images.length}
            </Text>
          </View>

          {/* NÚT QUAY LẠI */}
          <TouchableOpacity
            style={styles.overlayIMG}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={backIcon}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* NAME AND ADDRESS */}
        <View style={styles.container}>
          <Text style={styles.txtName}>
            {place.name}
          </Text>

          <View style={styles.addressRow}>
            <Image
              source={locationIcon}
              style={styles.locationIcon}
            />

            <Text style={styles.addressText}>
              {address.adr || "Chưa có địa chỉ"}
            </Text>

            <TouchableOpacity
              onPress={() => openMap(placeData)}
            >
              <Text style={styles.mapLink}>
                View map
              </Text>
            </TouchableOpacity>
          </View>

          {/* RATING */}
          <View style={styles.rating}>
            <View style={styles.ratingItem}>
              <Image
                source={star}
                style={styles.starIcon}
              />

              <Text>
                {" "}
                {place.rate ?? 0}/5
              </Text>
            </View>

            <TouchableOpacity
              style={styles.ratingItem}
              onPress={() =>
                navigation.navigate(
                  "ReviewScreen",
                  { id: placeData.id }
                )
              }
            >
              <Text style={styles.grayText}>
                reviews
              </Text>

              <Image
                source={next}
                style={styles.nextIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.honrizonLine} />

        {/* FACILITIES AND SERVICES */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>
            Facilities & services
          </Text>

          <Text style={styles.facilitiesTxt}>
            {place.guest ?? 0} Guests{" "}
            {room.bedrooms?.quantity ?? 0} Bedrooms{" "}
            {room.beds?.quantity ?? 0} Beds{" "}
            {room.bathrooms?.quantity ?? 0} Bath
          </Text>

          {facilities.internet && (
            <View style={styles.facilitiesItem}>
              <Image
                source={Internet}
                style={styles.facilitiesImg}
              />

              <Text style={styles.facilitiesTxt}>
                Wifi
              </Text>
            </View>
          )}

          {facilities.kitchen && (
            <View style={styles.facilitiesItem}>
              <Image
                source={Kitchen}
                style={styles.facilitiesImg}
              />

              <Text style={styles.facilitiesTxt}>
                Kitchen
              </Text>
            </View>
          )}

          {facilities.pool && (
            <View style={styles.facilitiesItem}>
              <Image
                source={Pool}
                style={styles.facilitiesImg}
              />

              <Text style={styles.facilitiesTxt}>
                Pool
              </Text>
            </View>
          )}

          {facilities.outdoor && (
            <View style={styles.facilitiesItem}>
              <Image
                source={Outdoor}
                style={styles.facilitiesImg}
              />

              <Text style={styles.facilitiesTxt}>
                Outdoor
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate(
                "FacilitiesANDServiceScreen",
                { item: placeData }
              )
            }
          >
            <Text style={styles.txtBtn}>
              Show all
            </Text>
          </TouchableOpacity>

          <View style={styles.honrizonLine} />

          {/* REVIEWS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Reviews
              </Text>

              <TouchableOpacity
                style={styles.inlineButton}
                onPress={() =>
                  navigation.navigate(
                    "ReviewScreen",
                    { id: placeData.id }
                  )
                }
              >
                <Text style={styles.grayText}>
                  See all
                </Text>

                <Image
                  source={next}
                  style={styles.nextIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.reviewRating}>
              <Text style={styles.reviewScore}>
                {place.rate ?? 0}
              </Text>

              <Text>/5</Text>
            </View>
          </View>

          <View style={styles.honrizonLine} />

          {/* POLICIES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Policies
            </Text>

            <View style={styles.ruleView}>
              <Text style={styles.ruleTitle}>
                House rules
              </Text>

              <View style={styles.ruleInOut}>
                <Image
                  source={Clock}
                  style={styles.clockIcon}
                />

                <Text>
                  {" "}
                  Check in time:{" "}
                  {policies.checkIn?.from ?? "--"}
                  {" - "}
                  {policies.checkIn?.to ?? "--"}
                </Text>
              </View>

              <View style={styles.ruleInOut}>
                <Image
                  source={Clock}
                  style={styles.clockIcon}
                />

                <Text>
                  {" "}
                  Check out time before{" "}
                  {policies.checkOut ?? "--"}
                </Text>
              </View>
            </View>

            <Text style={styles.ruleTitle}>
              Checkin policies
            </Text>

            <Text style={styles.grayText}>
              View more to see policy information.
            </Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                navigation.navigate(
                  "PoliciesScreen",
                  { item: placeData }
                )
              }
            >
              <Text style={styles.txtBtn}>
                View more
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.honrizonLine} />

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description
            </Text>

            {images.length > 0 && (
              <Image
                source={{ uri: images[0] }}
                style={styles.DescriptionImg}
              />
            )}

            <Text style={styles.DescriptionTxt}>
              {limitWords(
                place.description || "",
                25
              )}
            </Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                navigation.navigate(
                  "DescriptionScreen",
                  { item: placeData }
                )
              }
            >
              <Text style={styles.txtBtn}>
                View more
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ==================================
          THANH ĐẶT PHÒNG CỐ ĐỊNH
          ================================== */}
      <View style={styles.bookingFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>
            From:
          </Text>

          <Text style={styles.priceText}>
            ${price}
          </Text>

          <Text style={styles.priceNight}>
            /night
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bookBtn}
          onPress={handleBookNow}
          activeOpacity={0.8}
        >
          <Text style={styles.bookTxt}>
            Book now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// =====================================
// STYLES
// =====================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  imageContainer: {
    position: "relative",
    width: "100%",
  },

  img: {
    height: 250,
    resizeMode: "cover",
  },

  overlayIMG: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },

  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  imageCounter: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 15,
    minWidth: 50,
    alignItems: "center",
  },

  imageCounterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },

  container: {
    padding: 15,
    backgroundColor: "#ffffff",
  },

  txtName: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 25,
    height: 25,
  },

  addressText: {
    flex: 1,
    marginLeft: 4,
  },

  mapLink: {
    color: "#58b5b9",
    textDecorationLine: "underline",
    marginLeft: 10,
  },

  rating: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    borderRadius: 5,
  },

  ratingItem: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },

  starIcon: {
    width: 15,
    height: 15,
  },

  nextIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    marginLeft: 5,
  },

  grayText: {
    color: "#5a5b5d",
  },

  honrizonLine: {
    backgroundColor: "#fafafa",
    height: 3,
    marginVertical: 10,
  },

  section: {
    marginTop: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inlineButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  facilitiesItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  facilitiesImg: {
    width: 15,
    height: 15,
    marginRight: 10,
  },

  facilitiesTxt: {
    color: "#656668",
  },

  btn: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#96959a",
  },

  txtBtn: {
    margin: 10,
    color: "#999a9c",
    textAlign: "center",
    fontSize: 16,
  },

  reviewRating: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  reviewScore: {
    fontSize: 24,
    fontWeight: "bold",
  },

  ruleView: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },

  ruleTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },

  ruleInOut: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  clockIcon: {
    width: 15,
    height: 15,
  },

  DescriptionImg: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  DescriptionTxt: {
    marginTop: 10,
    color: "#6f7072",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  loadingText: {
    marginTop: 10,
    color: "#656668",
  },

  // THANH BOOKING CỐ ĐỊNH
  bookingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingHorizontal: 20,
    paddingVertical: 12,
    ...Platform.select({
      web: {
        boxShadow: "0px -2px 8px rgba(0,0,0,0.08)",
      },
      default: {
        elevation: 5,
      },
    }),
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    flex: 1,
  },

  priceLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 5,
  },

  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222222",
  },

  priceNight: {
    fontSize: 14,
    color: "#666666",
  },

  bookBtn: {
    backgroundColor: "#00bcd5",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  bookTxt: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
