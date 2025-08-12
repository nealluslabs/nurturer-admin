import { createSlice } from '@reduxjs/toolkit';

const initialState = {
       myGroups: [], 
       allGroups: [], 
       allCategories:[],
       allPacks:[],
       saveAllSongs: [],
       singlePack:{},
       allSectionVideos:[],
       categoryVideos:[],
       subjectsForAdding:[],
       subjectPastExams:[],
       categoryChapters:[],
       chapterSessions:[],
       chapterQuizzes:[],
       correctStudentId:null,
       presentOpenMenu:null,
       presentOpenChapter:null,
       presentOpenSession:null,
       requestedSection:null,
       subjectInfo:{},
       chapterInfo:{},
       teacherInfo:{},
       lessonInfo:{},
       pastExamInfo:{},
       quizInfo:{},
       publicGroups: [], 
       privateGroups: [],
       groupMembers: [], 
       employeer: {}, 
       currentFarmersToDisplay:[
        {
OriginalResponseId: "6753281ed9cdcb0033aec89e",
age: "50",
agentAddedId: "276",
agent_user_id: "673cba0ae048530033a98bf8",
challenges: "problème de matériel agricole tracteur ",
chemicals: "non ",
cost: "120000f",
createdAt: "2024-12-06T16:36:46.459Z",
cropType: "Cash Crops",
desire: "mes compétences ",
experience: "20ans",
familysize: "20",
farmSize: "7",
farmerId: "145147",
farmerName: "Rose Sagna",
farmingCrop: "none",
farmsize: "1ha",
firstName: "Rose",
gender: "féminin ",
gps: "12.7653468,-15.1089023",
harvestPurpose: "sales and family use",
harvestSize: "0 tons",
id: "67535b154f3f8f74863d69b5",
identification: "no",
index: 0,
insurance: "non ",
insuranceinterest: "Oui ",
interest: "Oui ",
lastHarvest: "30",
lastName: "Sagna",
location: "Oyo Nigeria",
locationName: "Département de Kolda, Région de Kolda, Sénégal",
market: "Local Market",
name: "Rose Sagna",
noOfChildren: 19,
noOfSpouse: 1,
offtake: "marché hebdomadaire de sare Yoba",
onboardDate: "06-12-2024",
organic: "non",
organicFarmingInterest: "Oui ",
password: "123456",
phone: "783870215",
photo: "https://res.cloudinary.com/fullstackbeast/image/upload/v1733502951/ufarmx/f6rw7dqfbnobf9cacwc6.jpg",
pre_retailer: "Fertilizer Seller",
produce: "riz  porc chèvre ",
productSoldTo: "Local market",
productionsize: "10sacs de 50kg",
seeds: "reserve personnel",
smartphone: "No",
tech: "non",
typeOfChemical: "none",
username: null,
"utilisezvous_lirrigation__oui_or_non": "non ",
_id:"67535b154f3f8f74863d69b5",
},

{
  OriginalResponseId: "6753281ed9cdcb0033aec89e",
  age: "50",
  agentAddedId: "276",
  agent_user_id: "673cba0ae048530033a98bf8",
  challenges: "problème de matériel agricole tracteur ",
  chemicals: "non ",
  cost: "120000f",
  createdAt: "2024-12-06T16:36:46.459Z",
  cropType: "Cash Crops",
  desire: "mes compétences ",
  experience: "20ans",
  familysize: "20",
  farmSize: "7",
  farmerId: "145147",
  farmerName: "Rose Sagna",
  farmingCrop: "none",
  farmsize: "1ha",
  firstName: "Rose",
  gender: "féminin ",
  gps: "12.7653468,-15.1089023",
  harvestPurpose: "sales and family use",
  harvestSize: "0 tons",
  id: "67535b154f3f8f74863d69b5",
  identification: "no",
  index: 0,
  insurance: "non ",
  insuranceinterest: "Oui ",
  interest: "Oui ",
  lastHarvest: "30",
  lastName: "Sagna",
  location: "Oyo Nigeria",
  locationName: "Département de Kolda, Région de Kolda, Sénégal",
  market: "Local Market",
  name: "Rose Sagna",
  noOfChildren: 19,
  noOfSpouse: 1,
  offtake: "marché hebdomadaire de sare Yoba",
  onboardDate: "06-12-2024",
  organic: "non",
  organicFarmingInterest: "Oui ",
  password: "123456",
  phone: "783870215",
  photo: "https://res.cloudinary.com/fullstackbeast/image/upload/v1733502951/ufarmx/f6rw7dqfbnobf9cacwc6.jpg",
  pre_retailer: "Fertilizer Seller",
  produce: "riz  porc chèvre ",
  productSoldTo: "Local market",
  productionsize: "10sacs de 50kg",
  seeds: "reserve personnel",
  smartphone: "No",
  tech: "non",
  typeOfChemical: "none",
  username: null,
  "utilisezvous_lirrigation__oui_or_non": "non ",
  _id:"67535b154f3f8f74863d69b5",
  }

],
       message: '',
      isLoading: false,
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    saveMyGroup: (state, action) => {
        state.myGroups = action.payload;
    },
    saveAllGroup: (state, action) => {
        state.allGroups = action.payload;
    },
    setRequestedSection: (state, action) => {
      state.requestedSection = action.payload;
   },
    saveSectionVideos: (state, action) => {
      state.allSectionVideos = action.payload;
  },
  saveSinglePack: (state, action) => {
    state.singlePack = action.payload;
},
  saveCorrectStudentId: (state, action) => {
    state.correctStudentId = action.payload;
  },
saveCategoryVideos: (state, action) => {
  state.categoryVideos = action.payload;
},
saveSubjectsForAdding: (state, action) => {
  state.subjectsForAdding = action.payload;
},
saveSubjectPastExams: (state, action) => {
  state.subjectPastExams = action.payload;
},
clearSubjectPastExams: (state, action) => {
  state.subjectPastExams = [];
},
clearSubjectsForAdding: (state, action) => {
  state.subjectsForAdding = [ ];
},
saveCategoryChapters: (state, action) => {
  state.categoryChapters = action.payload;
},
saveChapterSessions: (state, action) => {
  state.chapterSessions = action.payload;
},
saveChapterQuizzes: (state, action) => {
  state.chapterQuizzes = action.payload;
},
savePresentOpenMenu: (state, action) => {
  state.presentOpenMenu = action.payload;
},
savePresentOpenChapter: (state, action) => {
  state.presentOpenChapter = action.payload;
},
savePresentOpenSessions: (state, action) => {
  state.presentOpenSession = action.payload;
},
  saveCategories: (state, action) => {
    state.allCategories = action.payload;
},

savePacks: (state, action) => {
  state.allPacks = action.payload;
},

saveAllSongs: (state, action) => {
  state.allSongs = action.payload;
},

saveSubjectInfo: (state, action) => {
  state.subjectInfo = action.payload;
},
saveTeacherInfo: (state, action) => {
  state.teacherInfo = action.payload;
},
saveChapterInfo: (state, action) => {
  state.chapterInfo = action.payload;
},
saveQuizInfo: (state, action) => {
  state.quizInfo = action.payload;
},
saveLessonInfo: (state, action) => {
  state.lessonInfo = action.payload;
},
savePastExamInfo: (state, action) => {
  state.pastExamInfo = action.payload;
},
    savePublicGroup: (state, action) => {
        state.publicGroups = action.payload;
    },
    savePrivateGroup: (state, action) => {
        state.privateGroups = action.payload;
    },
    saveGroupMembers: (state, action) => {
      state.groupMembers = action.payload;
  },
    saveEmployeer: (state, action) => {
      state.employeer = action.payload;
  },
    isItLoading: (state, action) => {
      state.isLoading = action.payload;
  },
    clearGroup: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

const { actions, reducer } = groupSlice;

export const {
 saveMyGroup,
 saveAllGroup,
 saveSectionVideos,
 saveCategoryVideos,
 saveCategoryChapters,
 saveSubjectsForAdding,
 saveSubjectPastExams,
 clearSubjectPastExams,
 clearSubjectsForAdding,
 savePresentOpenMenu,
 saveCorrectStudentId,
 savePresentOpenChapter,
 savePresentOpenSessions,
 saveChapterSessions,
 saveChapterQuizzes,
 saveQuizInfo,
 savePublicGroup,
 saveSinglePack,
 saveCategories,
 savePacks,
 saveAllSongs,
 saveSubjectInfo,
 saveChapterInfo,
 saveTeacherInfo,
 saveLessonInfo,
 savePastExamInfo,
 savePrivateGroup,
 saveGroupMembers,
 saveEmployeer,
 setRequestedSection,
 isItLoading,
 clearGroup
} = actions;

export default reducer;


