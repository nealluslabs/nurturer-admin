import { db, fb, auth, storage } from '../../config/firebase';
import { clearUser, loginFailed, loginSuccess, logoutFxn, signupFailed, storeUserData } from '../reducers/auth.slice';
import { v4 as uuidv4 } from 'uuid';
import { notifyErrorFxn, notifySuccessFxn,notifyInfoFxn } from 'src/utils/toast-fxn';
import { isItLoading, saveAllGroup ,saveEmployeer,
         saveCategories ,saveGroupMembers, saveMyGroup,
         savePresentOpenSessions,savePresentOpenMenu ,savePublicGroup, saveSectionVideos,
          saveCategoryVideos,saveSubjectsForAdding,saveCategoryChapters,
        saveChapterSessions,saveChapterQuizzes,
        saveSinglePack,
        saveSubjectInfo,saveLessonInfo,saveQuizInfo,
        saveChapterInfo,saveTeacherInfo,saveCorrectStudentId,
         savePacks, clearSubjectsForAdding, clearSubjectPastExams, saveSubjectPastExams, savePastExamInfo, saveAllSongs } from '../reducers/group.slice';
import firebase from "firebase/app";
import axios from 'axios';

import { getTeachers } from './job.action';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


const sesClient = new SESClient({
  region: "eu-north-1", // e.g. "us-east-1" - come and remove these environemt variables before pushing o !
  credentials: {
    accessKeyId:process.env.REACT_APP_ACCESSKEYID_NURTURER,
    secretAccessKey:process.env.REACT_APP_SECRETACCESSKEY_NURTURER,
  },
});

 

let initialSentInPrompt;
let sentOut = false;
let atLeastOneContactwasGeneratedFor = false;
let generatedContacts = [];

// 🔹 Runs BEFORE any request is sent
axios.interceptors.request.use(
  config => {
    sentOut = true; // ✅ Marks that the request was initiated
    console.log('📤 Request initiated to:', config.url);
    return config;
  },
  error => {
    console.error('❌ Failed to initiate request:', error.message);
    return Promise.reject(error);
  }
);


export const createGroup = (groupData, user, file, navigate, setLoading, url) => async (dispatch) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();
   
  db.collection("groups").add({
    groupName: groupData.groupName,
    noOfSavers: groupData.noOfSavers,
    pin: groupData.pin,
    startDate: groupData.startDate,
    amount: groupData.amount,
    status: groupData.status.toLowerCase(),
    imageUrl: url,
    admins: [user.id],
    members: [user.id],
    accountCreated: today.toLocaleDateString("en-US", options),
}).then((res)=>{
    console.log("RESPONSE ID: ", res.id);
    return db.collection('groups').doc(res.id).update({
      groupId: res.id,
    }).then(() => {
        db.collection('groups').doc(res.id).collection('membersCollection').add({
            memberName: user.name,
            memberEmail: user.email,
            memberImageUrl: user.profileImg,
            invitedBy: user.id,
            invite: 0,
            paid: 0,
            users: [user.id, user.id],
            sentAt: today.toLocaleDateString("en-US", options),
          }).then((resp) => {
            console.log("membersCollection RESPONSE: ", resp);
            setLoading(false);
            db.collection('groups').doc(res.id).collection('membersCollection').doc(resp.id).update({
              id: resp.id,
            })
          }).then(() => {
            notifySuccessFxn("Group Created")
            setLoading(false);
            navigate('/dashboard/home', { replace: true });
          }).catch((err) => {
            console.error("Error creating group: ", err);
            var errorMessage = err.message;
            notifyErrorFxn(errorMessage);
            setLoading(false);
          })
    })
  })
}

export const createAnnouncement = (groupData) => async (dispatch) => {
   
  db.collection("announcements").add({
    title: groupData.title,
    description: groupData.description
}).then((res)=>{
    console.log("RESPONSE ID: ", res.id);
    return db.collection('announcements').doc(res.id).update({
      id: res.id,
    }).then(() => {
      notifySuccessFxn("Announcement Added")

        // db.collection('groups').doc(res.id).collection('membersCollection').add({
        //     memberName: user.name,
        //     memberEmail: user.email,
        //     memberImageUrl: user.profileImg,
        //     invitedBy: user.id,
        //     invite: 0,
        //     paid: 0,
        //     users: [user.id, user.id],
        //     sentAt: today.toLocaleDateString("en-US", options),
        //   }).then((resp) => {
        //     console.log("membersCollection RESPONSE: ", resp);
        //     setLoading(false);
        //     db.collection('groups').doc(res.id).collection('membersCollection').doc(resp.id).update({
        //       id: resp.id,
        //     })
        //   }).then(() => {
        //     notifySuccessFxn("Group Created")
        //     setLoading(false);
        //     navigate('/dashboard/home', { replace: true });
        //   }).catch((err) => {
        //     console.error("Error creating group: ", err);
        //     var errorMessage = err.message;
        //     notifyErrorFxn(errorMessage);
        //     setLoading(false);
        //   })
    })
  })
} 


export const updateTriggerDaysForAllContacts = (newTriggerDays) => async (dispatch) => {
  try {
    const snapshot = await db.collection("contacts").get();

    const batch = db.batch(); // batch updates are faster and atomic

    snapshot.forEach((doc) => {
      const docRef = db.collection("contacts").doc(doc.id);
      batch.update(docRef, { triggerDays: newTriggerDays });
    });

    await batch.commit();

    notifySuccessFxn("Trigger days updated for all contacts ✅");
  } catch (error) {
    console.error("Error updating triggerDays for all contacts:", error);
    notifyErrorFxn("Failed to update trigger days ❌");
  }
};




export const updateSettingsForAdminSettings = (updateObject) => async (dispatch) => {

  


  const docRef = db.collection("adminSettings").doc("KjE2Xz7avxs3Y5w4eXXF");
     docRef.update(
      {
        triggerDays: updateObject.frequency ,
        emailQuery:updateObject.emailQuery,
        eventQuery:updateObject.eventQuery,
        birthdayQuery:updateObject.birthdayQuery,
        holidayQuery:updateObject.holidayQuery
      }
    ).then(()=>{
      notifySuccessFxn("Settings Updated!")
    })

//dispatch(updateTriggerDaysForAllContacts(e.target.value)) //YOU STOPPED HERE DAGOGO - OCT 20




}

export const updateAllContacts = () => async (dispatch) => {
  try {
    const oldPhotoUrl = "https://nurturer.s3.eu-west-3.amazonaws.com/no-pic.png";
    const newPhotoUrl =
      "https://firebasestorage.googleapis.com/v0/b/bridgetech-advance-project.appspot.com/o/profile_images%2Fprofile.jpg?alt=media&token=b3c94ada-1b08-4834-bbd1-647882c7195a";

    // Query contacts that have the old photoUrl
    const snapshot = await db.collection("contacts").where("frequency", "!=", "None").get();

    if (snapshot.empty) {
      console.log("everyone has a frequency of None.");
      return;
    }

    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      const docRef = db.collection("contacts").doc(doc.id);
      batch.update(docRef, {sendDate:"20" });
    });

    await batch.commit();
    console.log(`✅ Updated ${snapshot.size} contacts with new photo URL successfully.`);
  } catch (error) {
    console.error("❌ Error updating contacts:", error);
  }
};



export const simulateCronJob =   () => async (dispatch) => {
  try {

    console.log("Cron job triggered at:", new Date().toISOString());
    let adminSettings
                                       //later I will remove this hardcoding
            const doc = await db.collection("adminSettings").doc("KjE2Xz7avxs3Y5w4eXXF").get();

             if (doc.exists) {
              adminSettings = doc.data();
            } else {
              console.error("Admin settings document not found!");
              return; // prevent continuing if it’s missing
            }

  //  await db.collection("adminSettings").doc("KjE2Xz7avxs3Y5w4eXXF").get().then((doc)=>{
  //   if(doc.exists){
  //    adminSettings = doc.data()
  //   }
  //  });


 

const generateAiMessage = async(messageType,Frequency,Name,JobTitle,Company,Industry,Interests,previousMessage,adminSettingsTriggerDays) =>  { //do not delete the other argumens they are being called by the query in the eval
            
 


  //AUG 29TH 2025 - USUALLY PROMPTS WILL BE EMAILS, BUT OCCASSIONALLY IF IT'S THE CONTACTS BIRTHDAY, OR A HOLIDAY, THEN A HOLIDAY PROMPT WILL BE SENT OUT
  //FOR NOW THOUGH WE WILL CHANGE THE PROMPT BASED ON THE MESSAGE TYPE BEING PASSED IN

 //const apiEndpoint =`https://nurturer-helper-api.vercel.app/api/om/chatgpt`
 const apiEndpoint =`https://pmserver.vercel.app/api/om/chatgpt`


//console.log("USER BEING PASSED INTO GENERATE AI MESSAGE--->",user)
 const prompt = 
   messageType === "Independence"?

    
   eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')

   :

   messageType === "Christmas"?

   eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')

  
     :


     messageType === "New Years"?

    
     eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')

     :
     messageType === "Thanksgiving"?
 
  
   eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')
 
  
     :
     messageType === "Labor Day"?
 
  
   eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')
 
  
     :
 
     messageType === "Memorial Day"?
 
  
   eval('`' + adminSettings.holidayQuery.replace(/\{\$/g, '${') + '`')
 
  
     :
   messageType === "Birthday"?


   eval('`' + adminSettings.birthdayQuery.replace(/\{\$/g, '${') + '`')
 
 
   :
   eval('`' + adminSettings.emailQuery.replace(/\{\$/g, '${') + '`')


 //const jobResponse = await axios.post(apiEndpoint,{prompt:prompt})
 initialSentInPrompt = prompt

    try {
      
      const jobResponse = await axios.post(apiEndpoint, { prompt });

      sentOut = true

      
    
      console.log("✅ OpenAI API call succeeded:", jobResponse.status, jobResponse.statusText);

      console.log("OUR RESPONSE FROM OUR BACKEND, WHICH CALLS CHAT GPT-->",jobResponse.data)

    const fullJobDetailsResponse = /*JSON.parse(jobResponse.data)*/jobResponse.data

    if(fullJobDetailsResponse){


      return {...fullJobDetailsResponse,createdAt:new Date(),messageStatus:"Pending"}

    }
      
      
    } catch (error) {
      // This block runs if the request fails
      if (error.response) {
        // The server responded but returned an error status code (e.g. 429, 500)
        console.error("❌ OpenAI API call failed:", error.response.status, error.response.statusText);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("⚠️ No response received from OpenAI API:", error.request);
      } else {
        // Something happened while setting up the request
        console.error("🚨 Error setting up request:", error.message);
      }
    
      // Optionally: you can also log the timestamp
      console.error("🕒 Error occurred at:", new Date().toISOString());
    }
    



}
 
const snapshot = await db
  .collection("contacts")
  .get();

if (snapshot.empty) {
  console.log("No contacts found.");
  return;
}
    let batch = db.batch();
    let contactsLog = [];
     let totalUsersAffected = 0;

    let writeCount = 0;
    let committedBatches = 0;
  
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const contacterId = data.contacterId;
  
      const userDoc = await db.collection("users").doc(contacterId).get();
      if (!userDoc.exists) {
        console.log(`No user found for contacterId: ${contacterId}`);
        continue;
      }

      //MY SETUP VARIABLES FOR BIRTHDAY
      const birthdayParts = data &&  data.birthday? data.birthday.split('/'): ('1/1/1980').split('/') ; // Split the date string (DD/MM/YYYY)
      const birthday = new Date(birthdayParts[2], birthdayParts[1] - 1, birthdayParts[0]); // Create a Date object
      const currentDate = new Date(); // Today's date

    // Calculate the difference in time (in milliseconds)
    const timeDifferenceBirthday = birthday - currentDate;

  // Convert the difference from milliseconds to a number (e.g., days, hours, etc.)
  const currentBirthdaySendDateNum = timeDifferenceBirthday; // In milliseconds

  const currentBirthdaySendDateNumInDays = Math.floor(timeDifferenceBirthday / (1000 * 60 * 60 * 24));

 //MY SETUP VARIABLES FOR BIRTHDAY - END


// MY SETUP VARIABLES FOR HOLIDAYS

// Define the holiday dates for the current year
const currentYear = currentDate.getFullYear();

// Christmas: December 25
const christmas = new Date(currentYear, 11, 25); // Month is 0-indexed, so 11 = December

// New Year's Day: January 1
const newYearsDay = new Date(currentYear+1, 0, 1);

// Independence Day: July 4
const independenceDay = new Date(currentYear, 6, 4); // 6 = July

// Memorial Day (last Monday in May)
const memorialDay = (() => {
  let d = new Date(currentYear, 4, 31); // May 31
  let day = d.getDay();
  return new Date(currentYear, 4, 31 - day); // Back up to Monday
})();

// Labor Day (first Monday in September)
const laborDay = (() => {
  let d = new Date(currentYear, 8, 1); // September 1
  let day = d.getDay();
  return new Date(currentYear, 8, day === 0 ? 2 : 9 - day); 
})();

// Thanksgiving (4th Thursday in November)
const thanksgiving = (() => {
  let d = new Date(currentYear, 10, 1); // November 1
  let day = d.getDay();
  let firstThursday = day <= 4 ? 4 - day : 11 - day;
  return new Date(currentYear, 10, firstThursday + 21); // + 3 more Thursdays
})();

// Function to get the difference in days (positive number)
const getDaysDifference = (holiday) => {
  const timeDifference = holiday - currentDate;
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

// Calculate the difference in days for each holiday
const christmasDays = getDaysDifference(christmas);
const newYearsDays = getDaysDifference(newYearsDay);
const independenceDays = getDaysDifference(independenceDay);
const memorialDays = getDaysDifference(memorialDay);
const laborDays =  getDaysDifference(laborDay);
const thanksgivingDays = 7/*getDaysDifference(thanksgiving)*/;

console.log("HOW MANY DAYS TILL THANKSGIVING--->",thanksgivingDays)

console.log("WHAT IS ADMIN SETTINGS TRIGGER DAYS --->",adminSettings && Number(adminSettings.triggerDays))


// MY SETUP VARIABLES FOR HOLIDAY END
  
      if (data.sendDate && data.frequency && data.frequency !=="None" && adminSettings) {
        const currentSendDateNum = Number(data.sendDate);
        let senderName = "";
        let sender = "";

        const userDoc = await db.collection('users')
          .doc(data.contacterId)
          .get();
        
        if (userDoc.exists) {
          senderName = userDoc.data().name;
          sender = userDoc.data();
        } else {
          senderName = ""; // or fallback values
          sender = "";

        }
        // currentBirthdaySendDateNum = Number(data.birthdaySendDate && data.birthdaySendDate); //not using this
       // const currentHolidaySendDateNum = Number(data.holidaySendDate && data.holidaySendDate);
  
        let updatedSendDate = data.sendDate;
        let updatedBirthdaySendDate =data.birthdaySendDate && data.birthdaySendDate; //dont need this anymore - i am using the contacts birthday
        let updatedHolidaySendDate =data.holidaySendDate && data.holidaySendDate; //dont need this anymore - i am using hardcoded days of july 4, christmans, new years
        let aiGeneratedMessage;
  
        if (currentSendDateNum === (adminSettings && Number(adminSettings.triggerDays)) && data && data.touchesAlert === true ) {

          console.log("GENERATE AI MESSAGE IS ABOUT TO TRIGGER FOR--->",data.name)
          aiGeneratedMessage = await generateAiMessage(
            "Email", 
            data.frequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Email"),
            adminSettings && Number(adminSettings.triggerDays)
           // userDoc.data(),
           // data
          );
          sentOut = true

           //send email notif to user
             generatedContacts.push({name:data.name,event:"Touches"})
             atLeastOneContactwasGeneratedFor =true
           //send email notif to user end


        }
  
        if (currentBirthdaySendDateNumInDays === (adminSettings && Number(adminSettings.triggerDays))  && data && data.eventsAlert === true) {
          aiGeneratedMessage = await generateAiMessage(
            "Birthday",
            data.birthdayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Birthday"),
            adminSettings && Number(adminSettings.triggerDays)
           // userDoc.data(),
           // data
          );
          sentOut = true



           //send email notif to user
           generatedContacts.push({name:data.name,event:"Birthday"})
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end


        }
  
        if (christmasDays === (adminSettings && Number(adminSettings.triggerDays)) && data && data.eventsAlert === true  ) {
          aiGeneratedMessage = await generateAiMessage(
            "Christmas",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
           // userDoc.data(),
           // data
          );

          sentOut = true


           //send email notif to user
           generatedContacts.push({name:data.name,event:"Christmas"})
           
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end
        }
        if (newYearsDays === (adminSettings && Number(adminSettings.triggerDays))  && data && data.eventsAlert === true ) {
          aiGeneratedMessage = await generateAiMessage(
            "New Years",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
          //  userDoc.data(),
          //  data
          );

          sentOut = true

           //send email notif to user
           generatedContacts.push({name:data.name,event:"New Years"})
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end
        }
        if ( independenceDays === (adminSettings && Number(adminSettings.triggerDays)) && data && data.eventsAlert === true  ) {
          aiGeneratedMessage = await generateAiMessage(
            "Independence",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
          //  userDoc.data(),
          //  data
          );

          sentOut = true

           //send email notif to user
           generatedContacts.push({name:data.name,event:"Fourth of July"})
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end
        }

        if (currentSendDateNum ===thanksgivingDays === (adminSettings && Number(adminSettings.triggerDays))  && data && data.eventsAlert === true ) {
          aiGeneratedMessage = await generateAiMessage(
            "Thanksgiving",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
          //  userDoc.data(),
          //  data
          );

          sentOut = true


           //send email notif to user
           generatedContacts.push({name:data.name,event:"Thanksgiving"})
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end

        }

        if (laborDays === (adminSettings && Number(adminSettings.triggerDays))  && data && data.eventsAlert === true ) {
          aiGeneratedMessage = await generateAiMessage(
            "Labor Day",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
          //  userDoc.data(),
          //  data
          );

          sentOut = true

           //send email notif to user
           generatedContacts.push({name:data.name,event:"Labor Day"})
           atLeastOneContactwasGeneratedFor =true
           //send email notif to user end
        }
        
        if (memorialDays === (adminSettings && Number(adminSettings.triggerDays))  && data && data.eventsAlert === true ) {
          aiGeneratedMessage = await generateAiMessage(
            "Memorial Day",
            data.holidayFrequencyInDays,
            data.name,
            data.jobTitle,
            data.company,
            data.industry,
            data.interests,
            userDoc.data().queryMsg?.find((item) => item.messageType === "Holiday"),
            adminSettings && Number(adminSettings.triggerDays)
          //  userDoc.data(),
          //  data
          );

          sentOut = true

           //send email notif to user

           generatedContacts.push({name:data.name,event:"Memorial Day"})
           atLeastOneContactwasGeneratedFor =true

           //send email notif to user end


        }
        /*else {
          updatedSendDate = String(currentSendDateNum - 1);
         
        }*/
  
        console.log("RAW MESSAGE THAT WAS JUST GENERATED BY AI -->", aiGeneratedMessage);
        //may need to shorten this ai prompt so it will work on this free tier CRON
  
        //we are updating the sendDate EVERYDAY, WHETHER AN AI MESSAGE IS GENERATED OR NOT
        updatedSendDate =currentSendDateNum > 1 ? String(currentSendDateNum - 1): String(data.frequencyInDays);

        const updatedMessage = {
          firstParagraph: aiGeneratedMessage?aiGeneratedMessage.firstParagraph:"",
          secondParagraph: aiGeneratedMessage?aiGeneratedMessage.secondParagraph:"",
          thirdParagraph: aiGeneratedMessage?aiGeneratedMessage.thirdParagraph:"",
          bulletPoints: aiGeneratedMessage?aiGeneratedMessage.bulletPoints:"",
          subject: aiGeneratedMessage?aiGeneratedMessage.subject:"",
          messageStatus:"Pending",
          createdAt:new Date(),
          messageType: aiGeneratedMessage?.messageType || "Email",
        };
  
        //console.log("USER BEING UPDATED IS -->", data);
        console.log("HOW MANY DAYS TILL THANKSGIVING--->",thanksgivingDays)

console.log("WHAT IS ADMIN SETTINGS TRIGGER DAYS --->",adminSettings && Number(adminSettings.triggerDays))
  


        //RELEASING EMAILS WHEN SEND DATE BECOMES ZERO


        if( currentSendDateNum === 1 ){
          //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE EMAIL

          //THANKSGIVING SENDING


          if(thanksgivingDays===0  &&  data.eventsAlert !==null && data.eventsAlert ===true  ){
            //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE HOLIDAY
 
          try {
           const params = {
             Destination: {
               ToAddresses: [data.email],
             },
             Message: {
               Body: {
                 Html: {
                   Data: `
                    
                     <p>Dear <strong>${data.name || ''}</strong>,</p>
                     <br/>
           
                     <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                     <br/>
           
                     <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                     <br/>
           
                    
                     <br/>
           
                     <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                     <br/>

                     <p>Warm Regards,</p>
                     <p>– ${senderName}</p>
                      
                     <br/>
                     
                     <div style="text-align:left; margin: 20px 0;">
                     <img src="https://nurturer-newsletter.s3.eu-west-3.amazonaws.com/thanksgiving-image-for-email.png"
                          alt="Thanksgiving Card"
                          style="width:300px; height:300px; object-fit:cover;" />
                   </div>
           
                    
                   `,
                 },
                 Text: {
                   Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                 },
               },
               Subject: {
                 Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
               },
             },
             Source: 'info@nurturer.ai', // must be verified in SES
           };
           
           const command = new SendEmailCommand(params);
            await sesClient.send(command);
       
          // console.log("✅ Email sent successfully:", response.MessageId);
          // return response;
         } catch (error) {
           console.error("❌ Error sending email:", error);
           throw error;
         }
   
         //SEND EMAIL END
 
           const updatedMessageQueue = [...data.messageQueue];
 
           // Find the index of the most recent email (assuming array is in chronological order)
           // If not, we’ll sort it before finding
           const emailMessages = updatedMessageQueue
             .map((msg, index) => ({ ...msg, index }))
             .filter(msg => msg.messageType === "Holiday");
         
           if (emailMessages.length > 0) {
             // Get the last (most recent) email
             const mostRecentEmail = emailMessages[emailMessages.length - 1];
             const msgIndex = mostRecentEmail.index;
         
             // Update the messageStatus
             updatedMessageQueue[msgIndex] = {
               ...updatedMessageQueue[msgIndex],
               messageStatus: "Sent",
             };
 
 
 
           batch.update(doc.ref, {
             
             
             messageQueue: updatedMessageQueue,
           });
         }
       }


          //THANKSGIVING SENDING END

       if(data.touchesAlert !==null && data.touchesAlert ===true  ){
          try {
            const params = {
              Destination: {
              ToAddresses: [data.email],
              },
              Message: {
                Body: {
                  Html: {
                    Data: `
                      
                      <p>Dear <strong>${data.name || ''}</strong>,</p>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                      <br/>
            
                      <ul>
                        ${
                          (data.messageQueue &&
                           data.messageQueue[data.messageQueue.length - 1] &&
                           data.messageQueue[data.messageQueue.length - 1].bulletPoints)
                            ? data.messageQueue[data.messageQueue.length - 1].bulletPoints.map(
                                bp => `
                                  <li>
                                    <strong>${bp.bulletPointBold || ''}</strong> — ${bp.bulletPointRest || ''} 
                                    <a href="${bp.link || '#'}" target="_blank">${bp.link || ''}</a>
                                  </li>`
                              ).join('')
                            : ''
                        }
                      </ul>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                      <br/>
            
                      <p>Warm Regards,</p>
                      <p>– ${senderName}</p>
                    `,
                  },
                  Text: {
                    Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                  },
                },
                Subject: {
                  Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                },
              },
              Source: 'info@nurturer.ai', // must be verified in SES
            };
            
        
            const command = new SendEmailCommand(params);
             await sesClient.send(command);
        
            //console.log("✅ Email sent successfully:", response.MessageId);
           // return response;
          } catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
          }

          //SEND EMAIL END
    

          const updatedMessageQueue = [...data.messageQueue];

          // Find the index of the most recent email (assuming array is in chronological order)
          // If not, we’ll sort it before finding
          const emailMessages = updatedMessageQueue
            .map((msg, index) => ({ ...msg, index }))
            .filter(msg => msg.messageType === "Email");
        
        
            // Get the last (most recent) email
            const mostRecentEmail = emailMessages ?emailMessages[emailMessages.length - 1]:{index:0};
            const msgIndex = mostRecentEmail?mostRecentEmail.index:0;
        
            // Update the messageStatus
            updatedMessageQueue[msgIndex] = {
              ...updatedMessageQueue[msgIndex],
              messageStatus: "Sent",
            };

          batch.update(doc.ref, {
           
            messageQueue: updatedMessageQueue,
          });
        
      }

        if( currentBirthdaySendDateNum === 0 && data.eventsAlert !==null && data.eventsAlert ===true  ){
         //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE BIRTHDAY

         try {
          const params = {
            Destination: {
              ToAddresses: [data.email],
            },
            Message: {
              Body: {
                Html: {
                  Data: `
                   
                    <p>Dear <strong>${data.name || ''}</strong>,</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                    <br/>
          
                    <ul>
                      ${
                        (data.messageQueue &&
                         data.messageQueue[data.messageQueue.length - 1] &&
                         data.messageQueue[data.messageQueue.length - 1].bulletPoints)
                          ? data.messageQueue[data.messageQueue.length - 1].bulletPoints.map(
                              bp => `
                                <li>
                                  <strong>${bp.bulletPointBold || ''}</strong> — ${bp.bulletPointRest || ''} 
                                  <a href="${bp.link || '#'}" target="_blank">${bp.link || ''}</a>
                                </li>`
                            ).join('')
                          : ''
                      }
                    </ul>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                    <br/>
          
                    <p>Warm Regards,</p>
                    <p>– ${senderName}</p>
                  `,
                },
                Text: {
                  Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                },
              },
              Subject: {
                Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
              },
            },
            Source: 'info@nurturer.ai', // must be verified in SES
          };
          
      
          const command = new SendEmailCommand(params);
           await sesClient.send(command);
      
          //console.log("✅ Email sent successfully:", response.MessageId);
         // return response;
        } catch (error) {
          console.error("❌ Error sending email:", error);
          throw error;
        }
  
        //SEND EMAIL END

         const updatedMessageQueue = [...data.messageQueue];

          // Find the index of the most recent email (assuming array is in chronological order)
          // If not, we’ll sort it before finding
          const emailMessages = updatedMessageQueue
            .map((msg, index) => ({ ...msg, index }))
            .filter(msg => msg.messageType === "Birthday");
        
        
            // Get the last (most recent) email
            const mostRecentEmail = emailMessages[emailMessages.length - 1];
            const msgIndex = mostRecentEmail.index;
        
            // Update the messageStatus
            updatedMessageQueue[msgIndex] = {
              ...updatedMessageQueue[msgIndex],
              messageStatus: "Sent",
            };

          batch.update(doc.ref, {
           
            messageQueue: updatedMessageQueue,
          });
        

        }
        if(  christmasDays === 0 && data.eventsAlert !==null && data.eventsAlert ===true   ){
           //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE BIRTHDAY

         try {
          const params = {
            Destination: {
              ToAddresses: [data.email],
            },
            Message: {
              Body: {
                Html: {
                  Data: `
                   
                    <p>Dear <strong>${data.name || ''}</strong>,</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                    <br/>
          
                    <ul>
                      ${
                        (data.messageQueue &&
                         data.messageQueue[data.messageQueue.length - 1] &&
                         data.messageQueue[data.messageQueue.length - 1].bulletPoints)
                          ? data.messageQueue[data.messageQueue.length - 1].bulletPoints.map(
                              bp => `
                                <li>
                                  <strong>${bp.bulletPointBold || ''}</strong> — ${bp.bulletPointRest || ''} 
                                  <a href="${bp.link || '#'}" target="_blank">${bp.link || ''}</a>
                                </li>`
                            ).join('')
                          : ''
                      }
                    </ul>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                    <br/>
          
                    <p>Warm Regards,</p>
                    <p>– ${senderName}</p>
                  `,
                },
                Text: {
                  Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                },
              },
              Subject: {
                Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
              },
            },
            Source: 'info@nurturer.ai', // must be verified in SES
          };
          
      
          const command = new SendEmailCommand(params);
         await sesClient.send(command);
      
         // console.log("✅ Email sent successfully:", response.MessageId);
         // return response;
        } catch (error) {
          console.error("❌ Error sending email:", error);
          throw error;
        }
  
        //SEND EMAIL END


          const updatedMessageQueue = [...data.messageQueue];

          // Find the index of the most recent email (assuming array is in chronological order)
          // If not, we’ll sort it before finding
          const emailMessages = updatedMessageQueue
            .map((msg, index) => ({ ...msg, index }))
            .filter(msg => msg.messageType === "Holiday");
        
          if (emailMessages.length > 0) {
            // Get the last (most recent) email
            const mostRecentEmail = emailMessages[emailMessages.length - 1];
            const msgIndex = mostRecentEmail.index;
        
            // Update the messageStatus
            updatedMessageQueue[msgIndex] = {
              ...updatedMessageQueue[msgIndex],
              messageStatus: "Sent",
            };

          batch.update(doc.ref, {
           
           
            messageQueue: updatedMessageQueue,
          });
        }

      }
        if( independenceDays===0  && data.eventsAlert !==null && data.eventsAlert ===true  ){
           //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE BIRTHDAY

         try {
          const params = {
            Destination: {
              ToAddresses: [data.email],
            },
            Message: {
              Body: {
                Html: {
                  Data: `
                   
                    <p>Dear <strong>${data.name || ''}</strong>,</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                    <br/>
          
                    <ul>
                      ${
                        (data.messageQueue &&
                         data.messageQueue[data.messageQueue.length - 1] &&
                         data.messageQueue[data.messageQueue.length - 1].bulletPoints)
                          ? data.messageQueue[data.messageQueue.length - 1].bulletPoints.map(
                              bp => `
                                <li>
                                  <strong>${bp.bulletPointBold || ''}</strong> — ${bp.bulletPointRest || ''} 
                                  <a href="${bp.link || '#'}" target="_blank">${bp.link || ''}</a>
                                </li>`
                            ).join('')
                          : ''
                      }
                    </ul>
                    <br/>
          
                    <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                    <br/>
          
                    <p>Warm Regards,</p>
                    <p>– ${senderName}</p>
                  `,
                },
                Text: {
                  Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                },
              },
              Subject: {
                Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
              },
            },
            Source: 'info@nurturer.ai', // must be verified in SES
          };
          
          const command = new SendEmailCommand(params);
           await sesClient.send(command);
      
         // console.log("✅ Email sent successfully:", response.MessageId);
         // return response;
        } catch (error) {
          console.error("❌ Error sending email:", error);
          throw error;
        }
  
        //SEND EMAIL END

          const updatedMessageQueue = [...data.messageQueue];

          // Find the index of the most recent email (assuming array is in chronological order)
          // If not, we’ll sort it before finding
          const emailMessages = updatedMessageQueue
            .map((msg, index) => ({ ...msg, index }))
            .filter(msg => msg.messageType === "Holiday");
        
          if (emailMessages.length > 0) {
            // Get the last (most recent) email
            const mostRecentEmail = emailMessages[emailMessages.length - 1];
            const msgIndex = mostRecentEmail.index;
        
            // Update the messageStatus
            updatedMessageQueue[msgIndex] = {
              ...updatedMessageQueue[msgIndex],
              messageStatus: "Sent",
            };



          batch.update(doc.ref, {
            
            
            messageQueue: updatedMessageQueue,
          });
        }
      }

        if( newYearsDays===0 && data.eventsAlert !==null && data.eventsAlert ===true   ){
          //RELEASE EMAIL HERE - THE MOST RECENT ONE IN THE ARRAY THAT HAS TYPE BIRTHDAY

          try {
            const params = {
              Destination: {
                ToAddresses: [data.email],
              },
              Message: {
                Body: {
                  Html: {
                    Data: `
                     
                      <p>Dear <strong>${data.name || ''}</strong>,</p>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].firstParagraph || ''}</p>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].secondParagraph || ''}</p>
                      <br/>
            
                      <ul>
                        ${
                          (data.messageQueue &&
                           data.messageQueue[data.messageQueue.length - 1] &&
                           data.messageQueue[data.messageQueue.length - 1].bulletPoints)
                            ? data.messageQueue[data.messageQueue.length - 1].bulletPoints.map(
                                bp => `
                                  <li>
                                    <strong>${bp.bulletPointBold || ''}</strong> — ${bp.bulletPointRest || ''} 
                                    <a href="${bp.link || '#'}" target="_blank">${bp.link || ''}</a>
                                  </li>`
                              ).join('')
                            : ''
                        }
                      </ul>
                      <br/>
            
                      <p>${data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].thirdParagraph || ''}</p>
                      <br/>
            
                      <p>Warm Regards,</p>
                      <p>– ${senderName}</p>
                    `,
                  },
                  Text: {
                    Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                  },
                },
                Subject: {
                  Data: data.messageQueue && data.messageQueue[data.messageQueue.length - 1] && data.messageQueue[data.messageQueue.length - 1].subject || '',
                },
              },
              Source: 'info@nurturer.ai', // must be verified in SES
            };
            
            const command = new SendEmailCommand(params);
            await sesClient.send(command);
        
           // console.log("✅ Email sent successfully:", response.MessageId);
           // return response;
          } catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
          }
    
          //SEND EMAIL END

          const updatedMessageQueue = [...data.messageQueue];

          // Find the index of the most recent email (assuming array is in chronological order)
          // If not, we’ll sort it before finding
          const emailMessages = updatedMessageQueue
            .map((msg, index) => ({ ...msg, index })) //CAPTURE THE INDEX B4 FILTERING - GENIUS!
            .filter(msg => msg.messageType === "Holiday");
        
          if (emailMessages.length > 0) {
            // Get the last (most recent) email
            const mostRecentEmail = emailMessages[emailMessages.length - 1];
            const msgIndex = mostRecentEmail.index;
        
            // Update the messageStatus
            updatedMessageQueue[msgIndex] = {
              ...updatedMessageQueue[msgIndex],
              messageStatus: "Sent",
            };



          batch.update(doc.ref, {
            
            
            messageQueue: updatedMessageQueue,
          });
        }
        }
      }

        //RELEASING EMAIL WHEN SEND DATE BECOMES ZERO - END


    if( currentSendDateNum === (adminSettings && Number(adminSettings.triggerDays))||currentBirthdaySendDateNum === (adminSettings && Number(adminSettings.triggerDays))|| christmasDays === (adminSettings && Number(adminSettings.triggerDays)) || independenceDays===(adminSettings && Number(adminSettings.triggerDays)) ||newYearsDays ===(adminSettings && Number(adminSettings.triggerDays)) || thanksgivingDays ===(adminSettings && Number(adminSettings.triggerDays)) || laborDays ===(adminSettings && Number(adminSettings.triggerDays)) || memorialDays ===(adminSettings && Number(adminSettings.triggerDays)) ){
      //WHEN ONE OF THESE DATE IS Number(adminSettings.triggerDays), AN AI MESSAGE WILL BE GENERATED FOR SURE
    
      if(aiGeneratedMessage && aiGeneratedMessage.firstParagraph){
      batch.update(doc.ref, {
        sendDate: updatedSendDate,
        //birthdaySendDate: updatedBirthdaySendDate,
        //holidaySendDate: updatedHolidaySendDate,
        messageQueue: firebase.firestore.FieldValue.arrayUnion(updatedMessage),
      });
    }
  }
    
    else{
      //OTHERWISE , WHEN NONE OF THESE DATES ARE Number(adminSettings.triggerDays), WE ARE NOT UPDATING THE MESSAGE QUEUE, JUST REDUCING THE COUNTDOWN
       batch.update(doc.ref, {
          sendDate: updatedSendDate,
          //birthdaySendDate: updatedBirthdaySendDate,
         // holidaySendDate: updatedHolidaySendDate,
        
        });
      }



      const isTodayHoliday = (christmasDays === 0 || newYearsDays === 0 || independenceDays === 0);
let whichHoliday = "";
if (christmasDays === 0) whichHoliday = "Christmas";
else if (newYearsDays === 0) whichHoliday = "New Years";
else if (independenceDays === 0) whichHoliday = "Independence Day";
else if (laborDays === 0) whichHoliday = "Labor Day";
else if (thanksgivingDays === 0) whichHoliday = "Thanksgiving Day";
else if (memorialDays === 0) whichHoliday = "Memorial Day";

const isHolidayAdminSendDate = (
  christmasDays ===adminSettings &&  Number(adminSettings.triggerDays) ||
  newYearsDays ===adminSettings && Number(adminSettings.triggerDays) ||
  independenceDays ===adminSettings && Number(adminSettings.triggerDays)||
  laborDays ===adminSettings && Number(adminSettings.triggerDays)||
  memorialDays === adminSettings && Number(adminSettings.triggerDays)||
  thanksgivingDays ===adminSettings && Number(adminSettings.triggerDays)
);



/**ADDING TO MY CONTACTS LOG ARRAY  */
const isBirthdayToday = currentBirthdaySendDateNumInDays === 0;

const isSendDateOne = Number(data.sendDate) === 1;

const isSendDateAdminSendDate = Number(data.sendDate) === Number(adminSettings.triggerDays);

contactsLog.push({
  contactName: data.name,
  contactEmail: data.email,
  contactId: data.uid,
  emailSubject:aiGeneratedMessage?aiGeneratedMessage:"no subject generated",
  wasEmailSentOutToday:isSendDateOne?"yes":"no",
  previousSendDate: data.sendDate,
  generatedMessage:
  {subject:aiGeneratedMessage?aiGeneratedMessage.subject:" ",
  firstParagragph:aiGeneratedMessage?aiGeneratedMessage.firstParagraph:"",
  secondParagragph:aiGeneratedMessage?aiGeneratedMessage.firstParagraph:"",
  },
  wasOpenAiRequestSent:sentOut?"yes":"no",
  
  initialMessagePrompt:initialSentInPrompt?initialSentInPrompt:"",
 
  newSendDate: updatedSendDate,
  isTodayHoliday,
  whichHoliday,
  isHolidayAdminSendDate,
  isSendDateOne,
  isSendDateAdminSendDate,
  isBirthdayToday
});

totalUsersAffected += 1;

/**ADDING TO MY CONTACTS LOG ARRAY - END */

        writeCount++;
  
        // 🔑 If batch reaches 500 writes, commit and start a new one
        if (writeCount === 500) {
          await batch.commit();
          committedBatches++;
          console.log(`Committed batch #${committedBatches} with 500 writes`); 
          batch = db.batch();
          writeCount = 0;
        }
      }
    }
  
    // Commit any remaining writes
    if (writeCount > 0) {
      await batch.commit();
      committedBatches++;
      console.log(`Committed final batch #${committedBatches} with ${writeCount} writes`);
    }


if(atLeastOneContactwasGeneratedFor){
    try {
      const params = {
        Destination: {
          ToAddresses: [sender.email],
        },
        Message: {
          Body: {
            Html: {
              Data: `
               
                <p>Dear <strong>${sender.name || ''}</strong>,</p>
                <br/>

                <p>Your Scheduled Messages have been successfully generated for the following contacts</p>
                <br/>
      
                <p>${generatedContacts && generatedContacts.map((contact)=>(
                  <>
                  <p>{contact.name}- {contact.event}</p>
                  <br/>
                  </>

                ))}</p>
                <br/>
      
                <p>You can review or edit these messages from your dashboard</p>
                <br/>
      
               
                <br/>
      
                <p>If you'd like us not to automatically send these messages on your behalf, simply disable your settings, or each contact's settings.</p>
                <br/>

                <p>Warm Regards,</p>
                <p>– The Nurturer Team</p>
                 
                <br/>
                
             
      
               
              `,
            },
            Text: {
              Data:'Your messages have been generated',
            },
          },
          Subject: {
            Data:'Your messages have been generated',
          },
        },
        Source: 'info@nurturer.ai', // must be verified in SES
      };
      
      const command = new SendEmailCommand(params);
       await sesClient.send(command);
  
     // console.log("✅ Email sent successfully:", response.MessageId);
     // return response;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }

  }




    await db.collection("cronlogs").add({
      createdAt: new Date(),
      totalUsersAffected,
      contacts: contactsLog
    });

    //return res.status(200).json({ message: `Contacts updated successfully. Total batches: ${committedBatches}` });
  
    return notifySuccessFxn("Contacts Updated Successfully, emails have been sent out!")
  } catch (error) {
    console.error(error);
    //return res.status(500).json({ error: error.message });

   return notifyErrorFxn("Error Updating contacts, please try again!")
  }
  
}



 





export const createMusicBriefs = (groupData) => async (dispatch) => {
   
  db.collection("musicBriefs").add({
    title: groupData.title,
    payout: groupData.payout,
    deadline: groupData.deadline,
    description: groupData.description
}).then((res)=>{
    // console.log("RESPONSE ID: ", res.id);
    return db.collection('musicBriefs').doc(res.id).update({
      id: res.id,
    }).then(() => {
      notifySuccessFxn("Music Brief Added");
    })
  })
}

export const createOneOnOnes = (groupData) => async (dispatch) => {
   
  db.collection("oneOnOnes").add({
    title: groupData.title,
    position: groupData.position,
    rate: groupData.rate,
    description: groupData.description
}).then((res)=>{
    // console.log("RESPONSE ID: ", res.id);
    return db.collection('oneOnOnes').doc(res.id).update({
      id: res.id,
    }).then(() => {
      notifySuccessFxn("One on One Added");
    })
  })
}


export const uploadUserSettings = (groupData = 0, file = 0, user = 0) => async (dispatch) => {
 if(file && file.length !== 0){

   /*LOGIC T0 RUN IF WE HAVE A PICTURE */

  const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
  console.log('File Name: ', imageName);
  const uploadTask = storage.ref(`profile_images/${imageName}`).put(file);
  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      // setProgress(progress);
    },
    error => {
      console.log(error);
      notifyErrorFxn("Error uploading image,please try again!")
    },
    () => {
      storage
        .ref("profile_images")
        .child(imageName)
        .getDownloadURL()
        .then(url => {
          console.log('Image URL: ', url);
          //dispatch(createGroup(groupData, user, file, navigate, setLoading, url));
 
  

    if(groupData.newPassword){
   //PASSWORD UPDATE LOGIC

   fb.auth().signInWithEmailAndPassword(groupData.email, groupData.password)
   .then((userCredential) => {
     // Signed in
     const user = fb.auth().currentUser;
    
     user.updatePassword(groupData.newPassword).then(() => {
       // Update successful.
       console.log("PASSWORD UPDATE WENT WELL")
     }).catch((error) => {
       // An error ocurred
       console.log("PASSWORD UPDATE FAILED HORRIBLY!")
     });

    
     db.collection('users')
     .doc(groupData.uid)
     .update({
      companySize:groupData.companySize,
      profileImage:url,
      password:groupData.newPassword
     }).then(()=>{
        notifySuccessFxn("data updated successfully")
     }).catch((error)=>{
      notifyErrorFxn("Error updating data,please try again!")
     })

   }).catch(()=>{
    notifyErrorFxn("Please try updating your password again...")
   })

        
          }

  
     if(!groupData.newPassword){
    db.collection('users')
  .doc(groupData.uid)
  .update({
   companySize:groupData.companySize,
   profileImage:url,
   
  }).then(()=>{
     notifySuccessFxn("data updated successfully")
  }).catch((error)=>{
   notifyErrorFxn("Error updating data,please try again!")
  })

  }
        });
    }
  );

} 

if(file.length === 0 && !groupData.newPassword){
   // WE HAVE NO IMAGE AND NO NEW PASSWORD
   db.collection('users')
   .doc(groupData.uid)
   .update({
    companySize:groupData.companySize
   }).then(()=>{
      notifySuccessFxn("data updated successfully")
   }).catch((error)=>{
    notifyErrorFxn("Error updating data,please try again!")
   })

}


if(file.length === 0 && groupData.newPassword){
  // WE HAVE NO IMAGE BUT A NEW PASSWORD
  
  //UPDATING THE PASSWORD
  fb.auth().signInWithEmailAndPassword(groupData.email, groupData.password)
  .then((userCredential) => {
    // Signed in
    const user = fb.auth().currentUser;

    user.updatePassword(groupData.newPassword).then(() => {
      // Update successful.
      console.log("PASSWORD UPDATE WENT WELL")
    }).catch((error) => {
      // An error ocurred
      console.log("PASSWORD UPDATE FAILED HORRIBLY!")
    });
   
    //UPDATING USER INFORMATION
  db.collection('users')
  .doc(groupData.uid)
  .update({
   companySize:groupData.companySize,
   password:groupData.newPassword
  }).then(()=>{
     notifySuccessFxn("data updated successfully")
  }).catch((error)=>{
   notifyErrorFxn("Error updating data,please try again!")
  })
  }).catch(()=>{
   notifyErrorFxn("Please try updating your password again...")
  })
  
 

}






}

export const fetchMyGroups = (coolers) => async (dispatch) => {
  console.log("Clicked...");
  dispatch(isItLoading(true));
  if (coolers.length) {
    const chunkSize = 10;
    const chunks = coolers.reduce((acc, _, i) => (i % chunkSize ? acc : [...acc, coolers.slice(i, i + chunkSize)]), []);
    const promises = chunks.map((chunk) => {
      return db
        .collection("groups")
        .where("groupId", "in", chunk)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data() })));
    });
    Promise.all(promises)
      .then((results) => {
        const myGroups = results.flat();
        console.log("My Groups Data:", myGroups);
        dispatch(saveMyGroup(myGroups));
        dispatch(isItLoading(false));
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        dispatch(isItLoading(false));
      });
  } else {
    dispatch(saveMyGroup(coolers));
    dispatch(isItLoading(false));
  }
};


// export const fetchMyGroups = (coolers) => async (dispatch) => {
//   console.log("Cilcked...")
//   dispatch(isItLoading(true));
//     if(coolers.length){
//       db.collection("groups")
//       . where('groupId', 'in', coolers)
//        .get()
//        .then((snapshot) => {
//         const myGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
//         console.log("DATA::: ", myGroups);
//         // return
//       if (myGroups.length) {
//         dispatch(isItLoading(false));
//         console.log("My Groups Data:", myGroups);
//         dispatch(saveMyGroup(myGroups));
//       } else {
//           dispatch(isItLoading(false));
//       }
//      }).catch((error) => {
//        console.log("Error getting document:", error);
//        dispatch(isItLoading(false));
//      });
//     }else{
//       dispatch(saveMyGroup(coolers));
//       dispatch(isItLoading(false));
//     }
//  };


export const fetchGroups = (adminID) => async (dispatch) => {
  dispatch(isItLoading(true));
  db.collection("groups")
  .where('admin', '==', adminID)
   .get()
   .then((snapshot) => {
     const allGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
   if (allGroups.length > 0) {
     dispatch(isItLoading(false));
     console.log("All Groups Data:", allGroups);
     dispatch(saveAllGroup(allGroups));
   } else {
       dispatch(isItLoading(false));
       dispatch(saveAllGroup(allGroups));
       console.log("No groups!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };


 export const fetchVideoSection = (chosenSection)=> async(dispatch) =>{

  //dispatch(isItLoading(true));
  db.collection("sections")
  .where('category', '==', chosenSection)
   .get()
   .then((snapshot) => {
     const allSectionVids = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
        return  array.sort((a,b)=>(a.subLevel - b.subLevel))
       }else{
        return []
       }
     }
     
     const sortedSectionVids = sortFunction(allSectionVids)


   if (allSectionVids.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL sections FROM DATABASE(FOR THIS CATEGORY):", sortedSectionVids);
     dispatch(saveCategoryVideos(sortedSectionVids));
   } else {
      // dispatch(isItLoading(false));
      dispatch(saveCategoryVideos(sortedSectionVids));
       console.log("No sections for this category!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };

 export const fetchSubjectsForAdding = (chosenSection)=> async(dispatch) =>{

  //dispatch(isItLoading(true));
  db.collection("sections")
  .where('category', '==', chosenSection)
   .get()
   .then((snapshot) => {
     const allSectionVids = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
        return  array.sort((a,b)=>(a.subLevel - b.subLevel))
       }else{
        return []
       }
     }
     
     const sortedSectionVids = sortFunction(allSectionVids)


   if (allSectionVids.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL sections FROM DATABASE(FOR THIS CATEGORY):", sortedSectionVids);
     dispatch(saveSubjectsForAdding(sortedSectionVids));
   } else {
      // dispatch(isItLoading(false));
      dispatch(clearSubjectsForAdding());
       console.log("No sections for this category!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };



 export const fetchSubjectsInPackDetails = (subjectsInPack)=> async(dispatch) =>{

  //dispatch(isItLoading(true));
  db.collection("sections")
  .where('uid', 'in', subjectsInPack)
   .get()
   .then((snapshot) => {
     const allSectionVids = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
        return  array.sort((a,b)=>(a.subLevel - b.subLevel))
       }else{
        return []
       }
     }
     
     const sortedSectionVids = sortFunction(allSectionVids)


   if (allSectionVids.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL sections FROM DATABASE(FOR THIS PACK ARE--->):", sortedSectionVids);
     dispatch(saveCategoryVideos(sortedSectionVids));
   } else {
      // dispatch(isItLoading(false));
      dispatch(saveCategoryVideos(sortedSectionVids));
       console.log("No sections for this category!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };





 export const fetchSubjectChapters = (chosenSection)=> async(dispatch) =>{

  db.collection("pastExams")
  .where("sectionId", "==", chosenSection )
   .get()
   .then(

    (snapshot) => {
      const pastExamsArray = snapshot.docs.map((doc) => ({ ...doc.data() }));
    if (pastExamsArray.length) {
     
      console.log(`pastExams for The subject ${chosenSection} are:`, pastExamsArray);
      dispatch(saveSubjectPastExams(pastExamsArray));
      return pastExamsArray
    } else {
     dispatch(clearSubjectPastExams([]));
        console.log(`No past exams for the subject; ${chosenSection}`);
        return []
    }
  }
   )




  //dispatch(isItLoading(true));
  db.collection("chapters")
  .where('sectionId', '==', chosenSection)
   .get()
   .then((snapshot) => {
     const allSectionChapters = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
        return  array.sort((a,b)=>(Number(a.chapterNumber) - Number(b.chapterNumber)))
       }else{
        return []
       }
     }
     
     const sortedSectionChapters = sortFunction(allSectionChapters)


   if (allSectionChapters.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL sections FROM DATABASE(FOR THIS CATEGORY):", sortedSectionChapters);
     dispatch(saveCategoryChapters(sortedSectionChapters));
   } else {
      // dispatch(isItLoading(false));
      dispatch(saveCategoryChapters(sortedSectionChapters));
       console.log("No sections for this category!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };





 export const fetchChapterSessions = (chosenChapter)=> async(dispatch) =>{

  //dispatch(isItLoading(true));
  db.collection("boneCourses")
  .where('chapterId', '==', chosenChapter)
   .get()
   .then((snapshot) => {
     const allChapterSessions = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
       
        return  array.sort((a,b)=>(Number(a.lessonNumber) - Number(b.lessonNumber) ))
       }else{
        return []
       }
     }
     
     const sortedChapterSessions = sortFunction(allChapterSessions)


   if (allChapterSessions.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL sessions FROM DATABASE(FOR THIS CHAPTER):", sortedChapterSessions);
     dispatch(saveChapterSessions(sortedChapterSessions));
   } else {
      // dispatch(isItLoading(false));
      dispatch(saveChapterSessions(sortedChapterSessions));
       console.log("No sections for this category!");
   }
 }).catch((error) => {
   console.log("Error getting document:", error);
   dispatch(isItLoading(false));
 });
 };


 export const fetchChapterQuizzes = (chosenChapter)=> async(dispatch) =>{

  //dispatch(isItLoading(true));
  db.collection("quizzes")
  .where('chapterId', '==', chosenChapter)
   .get()
   .then((snapshot) => {
     const allChapterQuizzes = snapshot.docs.map((doc) => ({ ...doc.data() }));
     const sortFunction = (array)=>{
      if (array.length){
       
        return  array.sort((a,b)=>(Number(a.lessonNumber) - Number(b.lessonNumber) ))
       }else{
        return []
       }
     }
     
     const sortedChapterQuizzes = sortFunction(allChapterQuizzes)


   if (allChapterQuizzes.length > 0) {
     //dispatch(isItLoading(false));
     console.log("ALL quizzes FROM DATABASE(FOR THIS CHAPTER):", sortedChapterQuizzes);
     dispatch(saveChapterQuizzes(sortedChapterQuizzes));
   } else {
      // dispatch(isItLoading(false));
      dispatch(saveChapterQuizzes([]));
       console.log("No quizzes for this chapter!");
   }
 }).catch((error) => {
   console.log("Error getting QUIZZES:", error);
   dispatch(isItLoading(false));
 });
 };


  /*======= DELETE A WHOLE CHAPTER ============= */

 export const deleteChapter = (chosenChapter,navigate)=> async(dispatch) =>{

  dispatch(isItLoading(true));

   db.collection("quizzes")
   .where('chapterId', '==', chosenChapter)
    .get()
    .then(async(snapshot) => {
      const allChapterQuizzes = snapshot.docs.map((doc) => ({ ...doc.data() }));
    
    if (allChapterQuizzes.length > 0) {
    
    notifyErrorFxn("Could not delete Chapter, please make sure to delete all quizzes within that chapter first")
    dispatch(isItLoading(false));
      return
    }else{
 
        db.collection("boneCourses")
        .where('chapterId', '==', chosenChapter)
         .get()
         .then(async(snapshot) => {
           const allChapterSessions = snapshot.docs.map((doc) => ({ ...doc.data() }));
      
         if (allChapterSessions.length > 0) {
           
          notifyErrorFxn("Could not delete Chapter, please make sure to delete all lessons within that chapter first")
          dispatch(isItLoading(false));
          return
          
         }else{
        
          let sectionId
          let itemToBeDeleted = db.collection("chapters").doc(chosenChapter)
          
          
          
          
          await itemToBeDeleted.get().then((doc) => {
           if (doc.exists) {
              sectionId = doc.data().sectionId
               dispatch(fetchSubjectChapters(doc.data().sectionId));
               //dispatch(savePresentOpenSessions(null))
            
               itemToBeDeleted.delete()
             
           } else {
             notifyErrorFxn("Problem Deleting the Chapter, please try again")
             dispatch(isItLoading(false));
             return
           }
          })
            
           .then((snapshot) => {
             dispatch(fetchSubjectChapters(sectionId));
              notifySuccessFxn("deleted chapter successfully")
              dispatch(isItLoading(false));
              navigate('/dashboard/courses')
           
          
          }).catch((error) => {
            console.log("Error deleting lesson:", error);
            notifyErrorFxn(error)
          
          
          });
         }
    
       })
    
   

    }


  })
.catch((error) => {
  notifyErrorFxn("Something went wrong while deleting, please try again")
  dispatch(isItLoading(false));
});




 }

 export const updatePackPrice = (packId,price) =>async (dispatch) => {

 db.collection("packs").doc(packId).update({
  price:price.toString()
   })

  console.log("the pack id is",packId)
   notifySuccessFxn(`new Price successfully updated!`)


  }


  export const fetchSinglePack = (packId) =>async (dispatch) => {

    db.collection("packs").doc(packId).get()
    .then((doc) => {
      console.log("THE SINGLE PACK'S FULL INFO IS-->",doc.data())
      
        dispatch(saveSinglePack(doc.data()))
     }).catch((error) => {
      console.log("Error fetching a particular subject from sections collection:", error);
    
    });
   
    
   
     }


  


 export const fetchSubjectInfo = (uid) =>async (dispatch) => {
  db.collection("sections").doc(uid).get().then((doc) => {
  console.log()
  
    dispatch(saveSubjectInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular subject from sections collection:", error);

});
};

export const fetchChapterInfo = (uid) =>async (dispatch) => {
  db.collection("chapters").doc(uid).get().then((doc) => {
  console.log("FRESHLY FETCHED FROM CHAPTERZ",doc.data())
  
    dispatch(saveChapterInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular chapter from chapters collection:", error);

});
};

export const fetchLessonInfo = (uid) =>async (dispatch) => {
  db.collection("boneCourses").doc(uid).get().then((doc) => {
  console.log()
  
    dispatch(saveLessonInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular lesson from boneCourses collection:", error);

});
};


export const fetchPastExamInfo = (uid) =>async (dispatch) => {
  db.collection("pastExams").doc(uid).get().then((doc) => {
  console.log()
  
    dispatch(savePastExamInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular past exam from past exams collection:", error);

});
};

export const fetchQuizInfo = (uid) =>async (dispatch) => {
  db.collection("quizzes").doc(uid).get().then((doc) => {

  
    dispatch(saveQuizInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular quiz from quizzes collection:", error);

});
};


export const fetchTeacherInfo = (uid) =>async (dispatch) => {
  db.collection("teachers").doc(uid).get().then((doc) => {
  console.log()
  
    dispatch(saveTeacherInfo(doc.data()))
 }).catch((error) => {
  console.log("Error fetching a particular TEACHER from teachers collection:", error);

});
};


 export const updateSubjectNow = (uid,updateObject) => async (dispatch) => {
 
  db.collection("sections").doc(uid).update({
      body:updateObject.body,
      category:updateObject.category,
      title:updateObject.title,
      //subLevel:updateObject.level,
      price:updateObject.price,
      instructor:updateObject.instructor,
      subjectImageUrl:updateObject.subjectImageUrl
      
    }).then((snapshot) => {
    
     notifySuccessFxn("updated Subject successfully")
     console.log("subject/ section has been updated oo ");

 }).catch((error) => {
   console.log("Error updating subject:", error);
   notifyErrorFxn(error)


 });



 };


 export const addTeacher = (addObject,navigate) => async (dispatch) => {


  db.collection("teachers")
  .where("firstName", "==", addObject.firstName)
  .where("lastName", "==", addObject.lastName)
  .get()
  .then((snapshot) => {
    const existingTeacher = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingTeacher.length) {
   
    notifyErrorFxn(`This teacher already exists,consider changing the name(s)`)

  } else {
     
    
    db.collection("teachers").add(
      {
        bio:addObject.body,
        firstName:addObject.firstName,
        lastName:addObject.lastName,
        level:addObject.level,
        imageUrl:addObject.imageUrl,
        registeredOn:new Date()

      }
    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("teachers").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the new  teacher's id is",doc.id)
      dispatch(getTeachers())
       notifySuccessFxn(`new Teacher ${addObject.firstName + " " + addObject.lastName} added!`)
       setTimeout(()=>{navigate('/dashboard/teacher-list')},1000)
   }).catch((error) => {
     console.log("Error adding teacher:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding subject:", error);
  notifyErrorFxn(error)


});

 };








 export const addSubject = (addObject) => async (dispatch) => {


  db.collection("sections")
  .where("title", "==", addObject.title)
  .where("category", "==", addObject.category)
  .get()
  .then((snapshot) => {
    const existingSubject = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingSubject.length) {
   
    notifyErrorFxn(`This subject already exists,consider changing the subject name`)

  } else {
     
    
    db.collection("sections").add(
      {
        body:addObject.body,
        category:addObject.category,
        title:addObject.title,
        subLevel:addObject.level,
        price:addObject.price,
        categoryId:addObject.categoryId,
        instructor:addObject.instructor
      }
    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("sections").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the documents id is",doc.id)
       notifySuccessFxn(`new subject ${addObject.title} added!`)
  
   }).catch((error) => {
     console.log("Error adding subject:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding subject:", error);
  notifyErrorFxn(error)


});

 };
 

 export const updateTeacher = (uid,updateObject,navigate) => async (dispatch) => {
 
  db.collection("teachers").doc(uid.trim()).update(
    {
      body:updateObject.body,
      firstName:updateObject.firstName,
      lastName:updateObject.lastName,
      imageUrl:updateObject.imageUrl,
      level:updateObject.level,
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
     dispatch(getTeachers())
     notifySuccessFxn("updated Teacher successfully")
     setTimeout(()=>{navigate('/dashboard/teacher-list')},1000)
 }).catch((error) => {
   console.log("Error updating document:", error);
   notifyErrorFxn(error)


 });
 };



 export const updateSubject = (uid,updateObject) => async (dispatch) => {
  console.log("I have reached the subject again land")
  db.collection("sections").doc(uid).update(
    {
      body:updateObject.body,
      category:updateObject.category,
      title:updateObject.title,
      subLevel:updateObject.subLevel,
      uid:uid
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
   
     notifySuccessFxn("updated Subject successfully")

 }).catch((error) => {
   console.log("Error updating document:", error);
   notifyErrorFxn(error)


 });
 };

 


 export const addChapter = (addObject) => async (dispatch) => {


  db.collection("chapters")
  .where("title", "==", addObject.title)
  .where("category", "==", addObject.category)
  .where("subject", "==", addObject.subject)
  .get()
  .then((snapshot) => {
    const existingSubject = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingSubject.length) {
   
    notifyErrorFxn(`This chapter already exists,consider changing the chapter name`)

  } else {
     
    
    db.collection("chapters").add(
      {
        body:addObject.body,
        category:addObject.category,
        title:addObject.title,
        sectionId:addObject.sectionId,
        subject:addObject.subject,
        chapterNumber:addObject.chapterNumber
      }
    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("chapters").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the documents id is",doc.id)
       notifySuccessFxn(`new chapter ${addObject.title} added!`)
  
   }).catch((error) => {
     console.log("Error adding chapter:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding chapter:", error);
  notifyErrorFxn(error)


});

 };




 export const addPastExam = (addObject) => async (dispatch) => {


  db.collection("pastExams")
  .where("examName", "==", addObject.name)
  .where("category", "==", addObject.category)
  .where("subject", "==", addObject.subject)
  .get()
  .then((snapshot) => {
    const existingSubject = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingSubject.length) {
   
    notifyErrorFxn(`This exam already exists,consider changing the exam name`)

  } else {
     
    
    db.collection("pastExams").add(
      {
       
        category:addObject.category,
        examName:addObject.name,
        sectionId:addObject.sectionId,
        subject:addObject.subject,
        examUrl:addObject.mediaUrl,
      }
    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("pastExams").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the documents id is",doc.id)
       notifySuccessFxn(`new exam ${addObject.name} added!`)
  
   }).catch((error) => {
     console.log("Error adding exam:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding chapter:", error);
  notifyErrorFxn(error)


});

 };



 export const updateChapter = (uid,updateObject) => async (dispatch) => {
  console.log("I have reached the chapter land")
  db.collection("chapters").doc(uid).update(
    {
      
      category:updateObject.category,
      title:updateObject.title,
      subject:updateObject.subject,
      chapterNumber:updateObject.chapterNumber,
      chapterPdfUrl:updateObject.chapterPdfUrl,
    
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
   
     notifySuccessFxn("updated chapter successfully")

 }).catch((error) => {
   console.log("Error updating document:", error);
   notifyErrorFxn("Problem Updating subject, please try again")


 });
 };


 export const updateLesson = (uid,updateObject) => async (dispatch) => {
 
  db.collection("boneCourses").doc(uid).update(
    {
     
     
      title:updateObject.title,
      section:updateObject.section,
      duration:updateObject.duration,
      body:updateObject.body,
      lessonNumber:updateObject.lessonNumber,
      lessonUrl:updateObject.lessonUrl,
    
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
     
     notifySuccessFxn("updated  Lesson successfully")

 }).catch((error) => {
   console.log("Error updating document:", error);
   notifyErrorFxn("Problem Updating subject, please try again")


 });
 };



 export const updatePastExam = (uid,updateObject) => async (dispatch) => {
 
  db.collection("pastExams").doc(uid).update(
    {
     
     
      examName:updateObject.examName,
     
      sectionId:updateObject.sectionId,
      category:updateObject.category,
      subject:updateObject.subject,
     
     
      examUrl:updateObject.examUrl,
    
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
     
     notifySuccessFxn("updated Exam successfully")

 }).catch((error) => {
   console.log("Error updating past exam:", error);
   notifyErrorFxn("Problem Updating past exam, please try again")


 });
 };



 export const deletePastExam = (uid) => async (dispatch) => {
  let sectionId
 let itemToBeDeleted = db.collection("pastExams").doc(uid)

 


 await itemToBeDeleted.get().then((doc) => {
  if (doc.exists) {
     sectionId = doc.data().sectionId
     itemToBeDeleted.delete()

      db.collection("pastExams")
      .where("sectionId", "==", sectionId )
       .get()
       .then(
    
        (snapshot) => {
          const pastExamsArray = snapshot.docs.map((doc) => ({ ...doc.data() }));
        if (pastExamsArray.length) {
         
          console.log(`pastExams for The subject ${sectionId} are:`, pastExamsArray);
          dispatch(saveSubjectPastExams(pastExamsArray));
          return pastExamsArray
        } else {
         dispatch(clearSubjectPastExams([]));
            console.log(`No past exams for the subject; ${sectionId}`);
            return []
        }
      }
       )
   
      
    
  } else {
    notifyErrorFxn("Problem Deleting Lesson, please try again")
  }
})
   
  .then((snapshot) => {
    
     notifySuccessFxn("deleted successfully")
  

 }).catch((error) => {
   console.log("Error deleting lesson:", error);
   notifyErrorFxn(error)


 });

 };







 export const deleteLesson = (uid) => async (dispatch) => {
  let chapterId
 let itemToBeDeleted = db.collection("boneCourses").doc(uid)

 


 await itemToBeDeleted.get().then((doc) => {
  if (doc.exists) {
     chapterId = doc.data().chapterId
      dispatch(fetchChapterSessions(doc.data().chapterId));
      //dispatch(savePresentOpenSessions(null))
   
      itemToBeDeleted.delete()
    
  } else {
    notifyErrorFxn("Problem Deleting Lesson, please try again")
  }
})
   
  .then((snapshot) => {
    dispatch(fetchChapterSessions(chapterId));
     notifySuccessFxn("deleted successfully")
  

 }).catch((error) => {
   console.log("Error deleting lesson:", error);
   notifyErrorFxn(error)


 });

 };

 export const deleteQuiz = (uid) => async (dispatch) => {
  let chapterId
 let itemToBeDeleted = db.collection("quizzes").doc(uid)

 


 await itemToBeDeleted.get().then((doc) => {
  if (doc.exists) {
     chapterId = doc.data().chapterId
      dispatch(fetchChapterSessions(doc.data().chapterId));
      //dispatch(savePresentOpenSessions(null))
   
      itemToBeDeleted.delete()
    
  } else {
    notifyErrorFxn("Problem Deleting Quiz, please try again")
  }
})
   
  .then((snapshot) => {
    dispatch(fetchChapterSessions(chapterId));
     notifySuccessFxn("deleted Quiz successfully")
  

 }).catch((error) => {
   console.log("Error deleting lesson:", error);
   notifyErrorFxn(error)


 });
 };



 export const addLesson = (addObject) => async (dispatch) => {


  db.collection("boneCourses")
  .where("title", "==", addObject.title)
  .where("category", "==", addObject.category)
  .where("section", "==", addObject.subject)
  .get()
  .then((snapshot) => {
    const existingLesson = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingLesson.length) {
   
    notifyErrorFxn(`This lesson already exists,consider changing the lesson name`)

  } else {
     
    
    db.collection("boneCourses").add(
      {
        body:addObject.body,
        category:addObject.category,
        title:addObject.title,
        chapterId:addObject.chapterId,
        duration:addObject.duration,
        section:addObject.subject,
        lessonUrl:addObject.lessonUrl,
        lessonNumber:addObject.lessonNumber
      }
    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("boneCourses").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the documents id is",doc.id)
       notifySuccessFxn(`new lesson ${addObject.title} added!`)
  
   }).catch((error) => {
     console.log("Error adding lesson:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding chapter:", error);
  notifyErrorFxn(error)


});

 };


 export const addQuiz = (addObject) => async (dispatch) => {


  db.collection("quizzes")
  .where("title", "==", addObject.title)
  .where("chapterId", "==", addObject.chapterId)
  .get()
  .then((snapshot) => {
    const existingQuiz = snapshot.docs.map((doc) => ({ ...doc.data() }));
  if (existingQuiz.length) {
   
    notifyErrorFxn(`This quiz already exists,consider changing the quiz name`)

  } else {
     
    
    db.collection("quizzes").add(
      {
        body:addObject.body,
        level:addObject.level,
        title:addObject.title,
        chapterId:addObject.chapterId,

        subject:addObject.subject,
        quizFileUrl:addObject.quizFileUrl,
        lessonNumber:addObject.lessonNumber,

       questionsArray:addObject.questionsArray
      }

    ).then((doc) => {
       //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
       db.collection("quizzes").doc(doc.id).update({
      uid:doc.id
       })
  
      console.log("the quiz's id is",doc.id)
       notifySuccessFxn(`new quiz ${addObject.title} added!`)
  
   }).catch((error) => {
     console.log("Error adding quiz:", error);
     notifyErrorFxn(error)
  
  
   });





  }
}).catch((error) => {
  console.log("Error adding chapter:", error);
  notifyErrorFxn(error)


});

 };


 

 export const updateQuiz = (updateObject,uid) => async (dispatch) => {
 
  db.collection("quizzes").doc(uid).update(
    {
     
      
      title:updateObject.title,
      body:updateObject.body,
      chapterId:updateObject.chapterId,
      level:updateObject.level,
      subject:updateObject.subject,
      
      lessonNumber:updateObject.lessonNumber,
      questionsArray:updateObject.questionsArray,
      quizFileUrl:updateObject.quizFileUrl
    
    }
  ).then((snapshot) => {
     //const publicGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
     
     notifySuccessFxn("Updated Quiz successfully")

 }).catch((error) => {
   console.log("Error updating quiz:", error);
   notifyErrorFxn("Problem Updating quiz, please try again")


 });
 };







 





/*========== do group fetching of categories HERE ======================= */

export const fetchAllCategories = () => async (dispatch) => {
  var categories = db.collection("categories");
  categories.get().then((snapshot) => {
    const groupMembers = snapshot.docs.map((doc) => ({ ...doc.data() }));
    console.log("ALL CATEGORIES ARE:",groupMembers)
    if (groupMembers.length) {
    dispatch(saveCategories(groupMembers));
  } else {
      console.log("No categories in database!");
  }
}).catch((error) => {
  console.log("Error getting categories:", error);
});
//return user;
};


/*===============do fetching of categories ABOVE ===================== */


/*========== do group fetching of packs HERE ======================= */

export const fetchAllPacks = () => async (dispatch) => {
  var categories = db.collection("packs");
  categories.get().then((snapshot) => {
    const groupMembers = snapshot.docs.map((doc) => ({ ...doc.data() }));
    console.log("ALL PACKS ARE:",groupMembers)
    if (groupMembers.length) {
    dispatch(savePacks(groupMembers));
  } else {
      console.log("No categories in database!");
  }
}).catch((error) => {
  console.log("Error getting categories:", error);
});
//return user;
};

/*===============do fetching of packs ABOVE ===================== */

export const fetchAllSongs = () => async (dispatch) => {
  var categories = db.collection("uploads");
  categories.get().then((snapshot) => {
    const allSongs = snapshot.docs.map((doc) => ({ ...doc.data() }));
    console.log("ALL SONGS ARE:",allSongs)
    if (allSongs.length) {
    dispatch(saveAllSongs(allSongs));
  } else {
      console.log("No Songs in database!");
  }
}).catch((error) => {
  console.log("Error getting categories:", error);
});
//return user;
};

/*===============Add to video watchlist and user watchlict BELOW ===================== */


export const updateVideoAndUserWatchlists = (userId,videoId) => async (dispatch) => {
  console.log('about to add title',videoId.trim())


  db.collection("courses").doc(videoId.trim()).update({
    watched:firebase.firestore.FieldValue.arrayUnion(userId)
  }).then((docRef) => {
    console.log(" course Document updated is: ", docRef);
    
    //dispatch(fetchWatchListData)
    //dispatch(playlistUpdate(true));
  })
  .catch((error) => {
    console.error("Error adding USER to  VIDEO watch List: ", error);
    notifyErrorFxn("Error adding USER to  VIDEO watch List: ")
    
  });





  
  db.collection("users").doc(userId).update({
  watched:firebase.firestore.FieldValue.arrayUnion(videoId),
  currentlyWatching:firebase.firestore.FieldValue.arrayUnion(videoId)
}).then((docRef) => {
  console.log("user Document updated is: ", docRef);
  
  //dispatch(fetchWatchListData)
  //dispatch(playlistUpdate(true));
})
.catch((error) => {
  console.error("Error adding video  to USER watch List: ", error);
  notifyErrorFxn("Error adding video  to USER watch List")
  
});




}

/*===============Add to video watchlist and user watchlict ABOVE ===================== */


/*===============Add  a SUBJECT TO A PACK ===================== */

export const addSubjectToPack = (subjectId,packId,packSubjects) => async (dispatch) => {
  console.log('about to add SUBJECT TO PACK',subjectId.trim())


  db.collection("packs").doc(packId.trim()).update({
    subjectsInPack:firebase.firestore.FieldValue.arrayUnion(subjectId)
  }).then((docRef) => {
    console.log(" course Document updated is: ", docRef);
    notifySuccessFxn("Successfully added to pack!")

    db.collection("packs").doc(packId.trim()).get().then((doc)=>{
    if(doc.exists){
      console.log("SUBJECTS IN OUR PACK-->",doc.data().subjectsInPack)
      //dispatch(fetchAllPacks()) - I COMMENTED IT OUT CUZ PERHAPS I DONT NEED TO LOAD NEW PACKS EVERY TIME?
     dispatch( fetchSubjectsInPackDetails(doc.data().subjectsInPack))
      //dispatch(savePresentOpenMenu(null))
     
    }else{
      notifyErrorFxn("I just updated this doc, now I cant find it?")
    }
    })
   
    //dispatch(fetchWatchListData)
    //dispatch(playlistUpdate(true));
  })
  .catch((error) => {
    console.error("Error adding this subject to the pack, please view--> : ", error);
    notifyErrorFxn("Error adding this subject to the pack, please try again. ")
    
  });


}

export const clearSubjectsBasedOnStudent = () => async (dispatch) => {
  dispatch(clearSubjectsForAdding());
}


export const fetchSubjectsBasedOnStudent = (studentId,email,setReadyList,setStudentId) => async (dispatch) => {
  dispatch(clearSubjectsForAdding());
  let correctId;
   
   /* db.collection("users").doc(studentId).get(
    ).then((doc) => {
   
  if(doc.exists){
      console.log("student being searched for is-->>: ", doc.data());
   dispatch(fetchSubjectsForAdding(doc.data().classOption))
    }else{*/
      

       db.collection("users")
  .where('email', '==', email)
   .get()
   .then((snapshot) => {
     const allGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
    
if(allGroups.length > 0){
  correctId = allGroups[0].uid
  dispatch(saveCorrectStudentId(allGroups[0].uid))
      console.log("THE FOUND STUDENT---->",allGroups[0])
    dispatch(fetchSubjectsForAdding(allGroups[0].classOption))
    notifyInfoFxn("Courses have been populated, please choose from the dropdown below")
}else{
  dispatch(clearSubjectsForAdding());
    notifyErrorFxn("No student with this Email,please try again")
}

 }).catch((error)=>{

   
    notifyErrorFxn("something went wrong,please try again")

 })

   /* }

  }).then(()=>{
    setReadyList(true)
  })
  .catch((error) => {
    console.error("Error adding video  to USER watch List: ", error);
 
    
  });*/

}



export const updatePurchasedCourses = (studentId,email,newPurchasedCourses,navigate) => async (dispatch) => {
  let accurateStudentId
  db.collection("purchasedCourses")
  .where('uid', '==', studentId)
   .get()
   .then((snapshot) => {
     const allGroups = snapshot.docs.map((doc) => ({ purchaseId:doc.id,...doc.data() }));
   if (allGroups.length > 0) {
      console.log("THE PURCHASED COURSE---->",allGroups)
    db.collection("purchasedCourses").doc(allGroups[0].purchaseId).update({
    // courses:firebase.firestore.FieldValue.arrayUnion(...newPurchasedCourses)
       courses:[...allGroups[0].courses,...newPurchasedCourses]
    })
    
    
    
    
    
    db.collection("users").doc(studentId).get().then((doc)=>{
    if(doc.exists){
      let newPurchasedCourseIds = newPurchasedCourses.map((item)=>(item.id))
    db.collection("users").doc(studentId)
    .update({
      //purchasedCourses:firebase.firestore.FieldValue.arrayUnion(newPurchasedCourses)
        purchasedCourses:[...doc.data().purchasedCourses,...newPurchasedCourseIds]
      }) 
    }else{

      db.collection("users")
      .where("email","==",email)
      .get() .then((snapshot) => {
        const allGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
         let correctId = allGroups[0].uid
         accurateStudentId = allGroups[0].uid
         let newPurchasedCourseIds = newPurchasedCourses.map((item)=>(item.id))
         console.log("THE FOUND STUDENT to update his/HER course---->",allGroups[0])
         db.collection("users").doc(correctId)
         .update({
           //purchasedCourses:firebase.firestore.FieldValue.arrayUnion(newPurchasedCourses)
           purchasedCourses:[...allGroups[0].purchasedCourses,...newPurchasedCourseIds]
           }) 
    
    })
    }


    }).then(()=>{

      notifySuccessFxn("orders sucessfully added")
      navigate("/dashboard/orders")
    })


      
    
    
   } else {
   
    db.collection("users").doc(studentId).get().then((doc)=>{
      if(doc.exists){
      db.collection("users").doc(studentId)
      .update({
        purchasedCourses:firebase.firestore.FieldValue.arrayUnion(...newPurchasedCourses)
          // courses:[...allGroups[0].courses,...newPurchasedCourses]
        }) 


        db.collection("purchasedCourses").add({
          courses:newPurchasedCourses,
          uid:studentId,
          createdAt:(new Date())
        })
    
      }else{
  
        db.collection("users")
        .where("email","==",email)
        .get() .then((snapshot) => {
          const allGroups = snapshot.docs.map((doc) => ({ ...doc.data() }));
           let correctId = allGroups[0].uid
           let newPurchasedCourseIds = newPurchasedCourses.map((item)=>(item.id))
           console.log("THE FOUND STUDENT to update his/HER course---->",allGroups[0])
           db.collection("users").doc(correctId)
           .update({
             //purchasedCourses:firebase.firestore.FieldValue.arrayUnion(newPurchasedCourses)
             purchasedCourses:[...allGroups[0].purchasedCourses,...newPurchasedCourseIds]
             }) 
      

             db.collection("purchasedCourses").add({
              courses:newPurchasedCourses,
              uid:correctId,
              createdAt:(new Date())
            })
        
      })
      }
  
  
      }).then(()=>{
  
        notifySuccessFxn("orders sucessfully added")
        navigate("/dashboard/orders")
      })
   }
 }).catch((error) => {
   console.log("Error getting Order:", error);
   notifyErrorFxn("Error adding order,please try again:")
   dispatch(isItLoading(false));
 });

}
