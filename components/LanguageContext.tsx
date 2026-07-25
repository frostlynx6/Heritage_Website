"use client";
import { createContext, useContext, useState } from "react";

export const translations = {
  EN: {
    navHome: "Home",
    navTrips: "Available Trips",
    navMyTrips: "My Trips",
    navInfo: "Information",
    navLogin: "Log In / Sign Up",
    heroTitle1: "Discover Singapore's",
    heroTitle2: "Living Heritage",
    heroDesc: "Embark on curated trails, collect exclusive badges, and uncover the hidden stories behind the Lion City.",
    startExploring: "Start Exploring",

    // Home features
    featureTrailsTitle: "Curated Trails",
    featureTrailsDesc: "From the lush Rail Corridor to the historic shores of Pulau Ubin, explore handpicked routes.",
    featureBadgesTitle: "Earn Badges",
    featureBadgesDesc: "Check in at iconic landmarks to unlock unique digital badges and build your heritage passport.",
    featureInsightsTitle: "Deep Insights",
    featureInsightsDesc: "Learn the rich history, culture, and architecture that shaped modern Singapore.",

    // Categories
    catAll: "All",
    catNature: "Nature",
    catCulture: "Culture & Heritage",
    catMuseums: "Museums & History",

    // Trips page
    curatedPill: "Curated Singapore Heritage Trails",
    tripsTitle: "Available Trips",
    tripsSubtitle: "Explore 10 signature destinations across Singapore. Mark your visits to earn unique badges!",
    attendedCounterLabel: "Attended Places",
    viewDetails: "View Details & Highlights",
    aboutThisLocation: "About this Location",
    keyHighlights: "Key Highlights",
    markAsAttended: "Mark as Attended",
    markedAsAttendedUndo: "Marked as Attended (Click to Undo)",
    loginToMark: "Log in to mark as attended",
    attendedPill: "Attended",

    // My Trips
    myPassportTitle: "My Explorer Passport",
    unlockedSummaryPrefix: "You have unlocked",
    unlockedSummaryOutOf: "out of",
    badgesWord: "badges.",
    earnedLabel: "Earned",
    lockedLabel: "Locked",

    // Info page
    visitorInfoTitle: "Visitor Information",
    overviewMapTitle: "Singapore Overview Map",
    overviewMapDesc: "Singapore is an island city-state located at the southern tip of the Malay Peninsula. Most heritage sites are accessible within a 45-minute drive.",
    mrtMapTitle: "MRT System Map",
    mrtMapDesc: "The Mass Rapid Transit (MRT) is the fastest way to get around. You can tap your standard Visa/Mastercard directly at the gantries to pay for rides.",

    // Auth modal
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    loginDesc: "Enter your details to access your heritage passport.",
    signupDesc: "Join us to start collecting badges across Singapore.",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    login: "Log In",
    signup: "Sign Up",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    switchToSignup: "Sign up here",
    switchToLogin: "Log in here",
    invalidCreds: "Invalid email or password.",
    unexpectedError: "An unexpected error occurred.",
    somethingWrong: "Something went wrong.",
  },
  ZH: {
    navHome: "首页",
    navTrips: "可选行程",
    navMyTrips: "我的行程",
    navInfo: "更多信息",
    navLogin: "登录 / 注册",
    heroTitle1: "探索新加坡的",
    heroTitle2: "文化遗产",
    heroDesc: "踏上精心策划的路线，收集专属徽章，揭开狮城背后的隐藏故事。",
    startExploring: "开始探索",

    // Home features
    featureTrailsTitle: "精选路线",
    featureTrailsDesc: "从郁郁葱葱的铁路走廊到乌敏岛的历史海岸，探索精心挑选的路线。",
    featureBadgesTitle: "解锁徽章",
    featureBadgesDesc: "在地标景点签到，解锁独特数字徽章，打造你的遗产护照。",
    featureInsightsTitle: "深度解读",
    featureInsightsDesc: "了解塑造现代新加坡的历史、文化与建筑。",

    // Categories
    catAll: "全部",
    catNature: "自然",
    catCulture: "文化与遗产",
    catMuseums: "博物馆与历史",

    // Trips page
    curatedPill: "新加坡精选路线",
    tripsTitle: "可选行程",
    tripsSubtitle: "探索新加坡代表性目的地。标记你的到访以解锁专属徽章！",
    attendedCounterLabel: "已到访地点",
    viewDetails: "查看详情并亮点",
    aboutThisLocation: "关于此地点",
    keyHighlights: "亮点",
    markAsAttended: "标记为已到访",
    markedAsAttendedUndo: "已标记（点击撤销）",
    loginToMark: "登录后即可标记到访",
    attendedPill: "已到访",

    // My Trips
    myPassportTitle: "我的探索护照",
    unlockedSummaryPrefix: "你已解锁",
    unlockedSummaryOutOf: "共",
    badgesWord: "枚徽章。",
    earnedLabel: "获得于",
    lockedLabel: "未解锁",

    // Info page
    visitorInfoTitle: "游客信息",
    overviewMapTitle: "新加坡概览地图",
    overviewMapDesc: "新加坡位于马来半岛南端的岛屿城市国家。大多数遗产地点在 45 分钟车程内可达。",
    mrtMapTitle: "地铁（MRT）线路图",
    mrtMapDesc: "MRT 是最便捷的出行方式。闸机可直接刷普通 Visa/Mastercard 完成支付。",

    // Auth modal
    welcomeBack: "欢迎回来",
    createAccount: "创建账户",
    loginDesc: "请输入信息以访问你的遗产护照。",
    signupDesc: "加入我们，开始收集全岛徽章。",
    fullName: "姓名",
    email: "电子邮箱",
    password: "密码",
    login: "登录",
    signup: "注册",
    noAccount: "还没有账户？",
    haveAccount: "已经有账户？",
    switchToSignup: "点击注册",
    switchToLogin: "点击登录",
    invalidCreds: "邮箱或密码错误。",
    unexpectedError: "发生未知错误。",
    somethingWrong: "出错了。",
  }
};

const LanguageContext = createContext<any>(null);

// Notice the { children } here!
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"EN" | "ZH">("EN");
  const t = translations[lang];

  const toggleLanguage = () => setLang(lang === "EN" ? "ZH" : "EN");

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);