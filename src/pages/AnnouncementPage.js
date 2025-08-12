import React, { useState, useEffect } from 'react';

import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { createAnnouncement } from "src/redux/actions/group.action";

// Firebase Firestore DB
import { db } from 'src/config/firebase';

const AnnouncementPage = () => {

    const dispatch = useDispatch();

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [editId, setEditId] = useState();
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncments] = useState();

    const getAnnouncements = async () => {
        try {
          const querySnapshot = await db.collection("announcements").get();
          const announcements = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAnnouncments(announcements);
        } catch (error) {
          console.error("Error getting documents:", error);
        }
      };

    const submitData = async () => {
        setLoading(true)
        if(!editId) {
            dispatch( createAnnouncement({ title, description }) );
            setTitle(""); setDescription(""); setLoading(false)
        }
        else {
            try {
                await db.collection("announcements").doc(editId).update({
                  title, description
                });
                console.log("User updated successfully!");
                setTitle(""); setDescription(""); setEditId(""); setLoading(false);
              } catch (error) {
                console.error("Error updating user:", error);
                setLoading(false)
              }
        }
    }

    const editData = (t, des, id) => {
        setTitle(t);
        setDescription(des);
        setEditId(id);
    }

    useEffect( () => {
        getAnnouncements();
    }, [] )

    return (
        <>
            <Box mx={2} mt={0.5}>
                
                <Box sx={{ width: "70%", margin: "2px auto" }}>
                    <Typography
                        sx={{ 
                            fontFamily: "inter", 
                            fontWeight: "bold", 
                            fontSize: "18px", 
                            display: "inline-block", 
                            borderBottom: "2px solid #DC2B8C" 
                        }}
                        mb={3}
                        px={0.5}
                    >ANNOUNCEMENTS</Typography>

                    <Box>
                        <input 
                            value={ title }
                            onChange={ e => setTitle(e.target.value) }
                            placeholder="Title" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <textarea 
                            value={ description }
                            onChange={ e => setDescription(e.target.value) }
                            placeholder="Description"
                            style={{ outline: "none", width: "100%", height: "250px", border: "1px solid #000000", padding: "4px 6px", fontSize: "14px" }}
                        />

                        <Box sx={{ width: "100%" }}>
                            <Box
                                sx={{ background: "linear-gradient(to right, #E61484, #3E256E)", width: "128px", margin: "21px auto", borderRadius: "12px", cursor: "pointer", marginTop: "42px", marginBottom: "42px" }}
                                p={1}
                                onClick={ () => submitData() }
                            >
                                <Typography 
                                    sx={{ textAlign: "center", color: "white", fontWeight: "bold", marginTop: "2px", fontFamily: "inter", fontSize: "14px" }}
                                >
                                    { loading ? "Loading..." : editId ? "EDIT" : "SUBMIT" }
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ border: "1px solid #DC2B8C" }} mb={3}></Box>

                    { announcements && announcements.map( item => (
                        <Box 
                            sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "90%", margin: "14px auto", border: "1px solid black" }}
                            px={6} py={2}
                        >
                            <Box>
                                <Typography sx={{ fontFamily: "inter", fontSize: "14px" }}>{ item.title }</Typography>
                                <Typography
                                    sx={{ fontSize: "12px", fontFamily: "inter" }}
                                >{ item.description }</Typography>
                            </Box>

                            <Box
                                sx={{background: "linear-gradient(to right, #E61484, #3E256E)",borderRadius: "12px", cursor: "pointer" }}
                                px={4} py={1.5}
                                onClick={ () => editData(item.title, item.description, item.id) }
                            >
                                <Typography sx={{ fontFamily: "inter", fontSize: "13px",color:"white"}}>
                                    EDIT
                                </Typography>
                            </Box>
                        </Box>
                    ) ) }
                </Box>
            </Box>
        </>
    )
}

export default AnnouncementPage;
