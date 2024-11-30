import React, { useState, useEffect } from "react";
import { User, Map, Trophy, Heart, Settings, ChevronRight } from "lucide-react";
import Header from "../landingPage/components/header/Header";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/auth/authContext";
import { doc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { catalanCountryNames } from "./catalanCountryNames/catalanCountryNames";
import WorldMap from "./worldMap/WorldMap";

const StatCard = ({ icon: Icon, title, value, bgColor = "text-blue-400" }) => (
  <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg">
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 ${bgColor}`} />
      <h3 className="text-sm font-medium text-white md:text-base">{title}</h3>
    </div>
    <p className="mt-4 text-2xl font-bold text-white">{value}</p>
  </div>
);

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("Usuario_013491");
  const [userRounds, setUserRounds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchCountryNames = async (rounds) => {
      const updatedRounds = await Promise.all(
        rounds.map(async (round) => {
          try {
            const response = await fetch(
              `https://restcountries.com/v3.1/name/${round.country}?fullText=true`,
            );
            const [countryData] = await response.json();
            return {
              ...round,
              countryNames: {
                default: round.country,
                es: countryData.translations.spa.common,
              },
            };
          } catch (error) {
            console.error(
              `Error fetching country data for ${round.country}:`,
              error,
            );
            return round;
          }
        }),
      );
      return updatedRounds;
    };

    const fetchUserRounds = async () => {
      if (!currentUser) {
        console.log("No current user");
        return;
      }

      try {
        console.log("Fetching rounds for user:", currentUser.uid);
        const userDoc = doc(db, "rounds", currentUser.uid);
        const userRoundsCollection = collection(userDoc, "userRounds");
        const q = query(userRoundsCollection, orderBy("timestamp", "desc"));

        const querySnapshot = await getDocs(q);
        console.log("Found rounds:", querySnapshot.size);

        const rounds = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch localized names for all countries
        const roundsWithNames = await fetchCountryNames(rounds);
        setUserRounds(roundsWithNames);
      } catch (error) {
        console.error("Error fetching rounds:", error);
        console.error("Error details:", error.code, error.message);
      }
    };

    fetchUserRounds();
  }, [currentUser]);

  const getCountryName = (countryNames) => {
    if (!countryNames) return "";

    if (i18n.language === "ca") {
      // Check if we have a special Catalan name for this country
      const catalanName = catalanCountryNames[countryNames.default];
      if (catalanName) {
        return catalanName;
      }
      // If no Catalan exception exists, use Spanish name
      return countryNames.es || countryNames.default;
    }

    return i18n.language === "es" && countryNames.es
      ? countryNames.es
      : countryNames.default;
  };

  // Calculate stats from userRounds
  const userStats = {
    completedMaps: [...new Set(userRounds.map((round) => round.country))]
      .length,
    averageScore:
      userRounds.length > 0
        ? `${Math.round(userRounds.reduce((acc, round) => acc + round.distance, 0) / userRounds.length)} km`
        : "0 km",
    favoriteAlgorithm: "Usuario",
  };

  // Get favorite routes (top 3 by distance)
  const favoriteRoutes = Object.values(
    userRounds.reduce((acc, round) => {
      const countryKey = round.country; // Use original name as key
      if (!acc[countryKey]) {
        acc[countryKey] = {
          name: round.country,
          countryNames: round.countryNames, // Store both names
          timesPlayed: 0,
          totalDistance: 0,
          lastPlayed: new Date(0),
        };
      }
      // Rest of the reduce logic remains the same
      acc[countryKey].timesPlayed += 1;
      acc[countryKey].totalDistance += round.distance;

      const roundDate = new Date(round.timestamp);
      if (roundDate > acc[countryKey].lastPlayed) {
        acc[countryKey].lastPlayed = roundDate;
      }

      return acc;
    }, {}),
  )
    .sort((a, b) => {
      if (b.timesPlayed !== a.timesPlayed) {
        return b.timesPlayed - a.timesPlayed;
      }
      return b.totalDistance - a.totalDistance;
    })
    .slice(0, 3)
    .map((route) => ({
      ...route,
      displayName: getCountryName(route.countryNames),
      score: `${Math.round(route.totalDistance)} km`,
      averageScore: `${Math.round(route.totalDistance / route.timesPlayed)} km`,
      date: route.lastPlayed.toLocaleDateString(),
    }));

  // Get recent scores (latest 3)
  const recentScores = [...userRounds]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 3)
    .map((round) => ({
      map: getCountryName(round.countryNames),
      score: `${Math.round(round.distance)} km`,
      algorithm: round.type,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-egg to-gray-800">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-400">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              {isEditing ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-1/2 rounded bg-gray-700 px-2 py-1 text-white md:w-auto"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    {t("save")}
                  </button>
                </form>
              ) : (
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {username}
                </h1>
              )}
              <p className="text-gray-400">{t("member_since")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 rounded-full bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            <span>{t("edit_profile")}</span>
          </button>
        </div>

        {/* Rest of the component remains the same */}
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={Map}
            title={t("completed_maps")}
            value={userStats.completedMaps}
          />
          <StatCard
            icon={Trophy}
            title={t("average_score")}
            value={userStats.averageScore}
            bgColor="text-yellow-400"
          />
          <StatCard
            icon={Heart}
            title={t("favorite_algorithm")}
            value={t("nearest_neighbor")}
            bgColor="text-red-400"
          />
        </div>
        <div className="mb-8 rounded-xl bg-gray-800/50 shadow-2xl">
          <WorldMap userRounds={userRounds} />
        </div>

        {/* Favorite Routes and Recent Scores */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Favorite Routes */}
          <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-400" />
                <h2 className="text-lg font-semibold text-white">
                  {t("favorite_routes")}
                </h2>
              </div>
              <button className="rounded-full p-1 text-white hover:bg-gray-700">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {favoriteRoutes.map((route, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4"
                >
                  <div>
                    <h3 className="font-medium text-white">
                      {route.displayName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t("last_played")} {route.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-400">
                      {t("times_played")} {route.timesPlayed}
                    </p>
                    <div className="flex justify-end gap-4">
                      <p className="text-sm text-gray-400">
                        Total: {route.score}
                      </p>
                      <p className="text-sm text-gray-400">
                        {t("average")} {route.averageScore}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Scores */}
          <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">
                  {t("recent_scores")}
                </h2>
              </div>
              <button className="rounded-full p-1 text-white hover:bg-gray-700">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {recentScores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4"
                >
                  <div>
                    <h3 className="font-medium text-white">{score.map}</h3>
                    <p className="text-sm text-gray-400">
                      {t(score.algorithm)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-yellow-400">
                      {score.score}
                    </p>
                    <p className="text-sm text-gray-400">{t("score")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
