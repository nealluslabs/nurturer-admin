import React, { useState, useEffect } from 'react';

import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { createMusicBriefs } from 'src/redux/actions/group.action';

// Firebase Firestore
import { db } from 'src/config/firebase';

const MusicBriefPage = () => {

    const dispatch = useDispatch();

    const [title, setTitle] = useState();
    const [payout, setPayout] = useState();
    const [deadline, setDeadline] = useState();
    const [description, setDescription] = useState();

    const [musicBrief, setMusicBrief] = useState();

    const [editId, setEditId] = useState();
    const [loading, setLoading] = useState(false);

    const dataDispatch = { title, payout, deadline, description }

    const data = [
        { heading: "MTV Search - Caught in The Act: DOUBLE LIFE", subHeading: "Deadline: Saturday, January 5 2024" },
        { heading: "SYNC DO'S & DONT'S", subHeading: "Deadline: Saturday, January 5 2024" }
    ];

    const getMusicBriefs = async () => {
        try {
          const querySnapshot = await db.collection("musicBriefs").get();
          const musicBriefs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMusicBrief(musicBriefs);
        } catch (error) {
          console.error("Error getting documents:", error);
        }
    };

    const submitData = async () => {
        setLoading(true);
        if(!editId) {
            dispatch(createMusicBriefs(dataDispatch))
            setTitle(""); setPayout(""); setDeadline(""); setDescription(""); setLoading(false);
        }
        else {
            try {
                await db.collection("musicBriefs").doc(editId).update({
                  title, description, payout, deadline
                });
                console.log("User updated successfully!");
                setTitle(""); setPayout(""); setDeadline(""); setDescription("");  setEditId(""); setLoading(false);
              } catch (error) {
                console.error("Error updating user:", error);
                setLoading(false)
              }
        }
    }

    const editData = (item) => {
        setTitle(item.title); setPayout(item.payout); setDeadline(item.deadline); setDescription(item.description);
        setEditId(item.id);
    }

    useEffect( () => {
        getMusicBriefs();
    }, [] )

    return (
        <>
            <Box mx={2} pr={4} mt={0.5}>

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
                    >MUSIC BRIEF</Typography>

                    <Box>
                        <input 
                            value={ title }
                            onChange={ (e) => setTitle(e.target.value) }
                            placeholder="Title" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <input 
                            value={ payout }
                            onChange={ (e) => setPayout(e.target.value) }
                            placeholder="Payout" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <input 
                            value={ deadline }
                            onChange={ (e) => setDeadline(e.target.value) }
                            placeholder="Deadline" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <textarea 
                            value={ description }
                            onChange={ (e) => setDescription(e.target.value) }
                            placeholder="Description"
                            style={{ outline: "none", width: "100%", height: "250px", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px" }}
                        />

                        <Box sx={{ width: "100%" }}>
                            <Box
                                sx={{ 
                                    background: "linear-gradient(to right, #E61484, #3E256E)", 
                                    width: "128px", 
                                    margin: "21px auto", 
                                    borderRadius: "12px", cursor: "pointer", marginTop: "42px", marginBottom: "42px" 
                                }}
                                p={1}
                                onClick={ () => submitData() }
                            >
                                <Typography 
                                    sx={{ textAlign: "center", color: "white", fontWeight: "bold", marginTop: "2px", fontSize: "14px", fontFamily: "inter" }}
                                >
                                    { loading ? "Loading..." : editId ? "EDIT" : "SUBMIT" }
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ border: "1px solid #DC2B8C" }} mb={3}></Box>

                    { musicBrief && musicBrief.map( item => (
                        <Box 
                            sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "90%", margin: "14px auto", border: "1px solid black" }}
                            px={6} py={2}
                        >
                            <Box>
                                <Typography sx={{ fontFamily: "Inter", fontSize: "14px" }}>
                                    { item.title } - { item.payout }
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "12px",  }}
                                >{ item.description }</Typography>
                            </Box>

                            <Box
                                sx={{background: "linear-gradient(to right, #E61484, #3E256E)",color:"white",/* background: "#DC2B8C",*/ borderRadius: "12px", cursor: "pointer" }}
                                px={4} py={1.5}
                                onClick={ () => editData(item) }
                            >
                                <Typography sx={{ fontFamily: "Inter", fontSize: "13px" }}>EDIT</Typography>
                            </Box>
                        </Box>
                    ) ) }
                </Box>
            </Box>
        </>
    )
}

export default MusicBriefPage;
