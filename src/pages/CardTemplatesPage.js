import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddIcon from '@mui/icons-material/Add';
import CakeIcon from '@mui/icons-material/Cake';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample images - you can replace with actual images
import BirthdayOne from "../assets/Birthday_1.png";
import BirthdayTwo from "../assets/Birthday_2.png";

import AnniversaryOne from "../assets/Anniversary_1.png";
import AnniversaryTwo from "../assets/Anniversary_2.png";

import thankYouOne from "../assets/thankyou_1.png";
import thankYouTwo from "../assets/thankyou_2.png";

import thanksgiving1 from "../assets/thanksgiving1.png";
import thanksgiving2 from "../assets/thanksgiving2.png";

import { useDispatch, useSelector } from 'react-redux';
import {
  CARD_TEMPLATE_IDS,
  fetchUserCardTemplates,
  setUserDefaultCardTemplate,
} from '../redux/actions/group.action';

export default function CardTemplatesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.uid || user?.user_id;
  const {
    defaultCardsByCategory,
    cardsUpdating,
    cardsUpdatingCategory,
  } = useSelector((state) => state.group);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCardTemplates(userId));
    }
  }, [dispatch, userId]);

  const isCategoryUpdating = (categoryId) =>
    cardsUpdating && cardsUpdatingCategory === categoryId;

  const isTemplateDefault = (categoryId, templateId) =>
    defaultCardsByCategory?.[categoryId]?.activeTemplateId === templateId;

  const isSetDefaultDisabled = (categoryId, templateId) =>
    isCategoryUpdating(categoryId) || isTemplateDefault(categoryId, templateId);

  const getSetDefaultLabel = (categoryId, templateId) => {
    if (isTemplateDefault(categoryId, templateId)) {
      return "Default";
    }

    if (isCategoryUpdating(categoryId)) {
      return "Updating...";
    }

    return "Set Default";
  };

  const handleSetDefault = (categoryId, templateId) => {
    if (isSetDefaultDisabled(categoryId, templateId)) {
      return;
    }

    if (!userId) {
      return;
    }

    dispatch(setUserDefaultCardTemplate(categoryId, templateId, userId));
  };

  return (
    <div style={{ padding: '24px' }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}
      >
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <CollectionsIcon sx={{ fontSize: 64, mr: 2 }} />
          Card Templates
        </Typography>

        <button 
          style={{ 
            background: '#20dbe4',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            textTransform: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AddIcon sx={{ marginRight: '8px' }} />
          Add new templates
        </button>
      </Box>
      <div
        style={{
          marginTop: "42px",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "24px",
        }}
      >
        
        <div style={{ width: "100%", backgroundColor: "white", padding: "6px", borderRadius: "8px", boxSizing: "border-box" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Birthday Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>
            
            <div style={{ width: "47%" }}>
              <img 
                src={BirthdayOne}
                alt="Birthday template one"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  // backgroundColor: "#f0f0f0",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: '12px 0 0 0' }}>
                Candles and Confetti
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{ 
                    display: "flex", alignItems: "center", 
                    cursor: isSetDefaultDisabled("birthday", CARD_TEMPLATE_IDS.birthday.first) ? "not-allowed" : "pointer", 
                    border: "1px solid blue", padding: "8px", borderRadius: "4px",
                  }}
                  onClick={() => handleSetDefault("birthday", CARD_TEMPLATE_IDS.birthday.first)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("birthday", CARD_TEMPLATE_IDS.birthday.first)}
                  </p>
                </div>

                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", marginLeft: "8px",
                    border: "1px solid red", padding: "8px", borderRadius: "4px", 
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

            <div style={{ width: "47%" }}>
              <img 
                src={BirthdayTwo}
                alt="Birthday template two"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: '12px 0 0 0' }}>
                Candles and Confetti
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{ 
                    display: "flex", alignItems: "center", 
                    cursor: isSetDefaultDisabled("birthday", CARD_TEMPLATE_IDS.birthday.second) ? "not-allowed" : "pointer", 
                    border: "1px solid blue", padding: "8px", borderRadius: "4px",
                    opacity: isSetDefaultDisabled("birthday", CARD_TEMPLATE_IDS.birthday.second) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("birthday", CARD_TEMPLATE_IDS.birthday.second)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("birthday", CARD_TEMPLATE_IDS.birthday.second)}
                  </p>
                </div>

                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", marginLeft: "8px",
                    border: "1px solid red", padding: "8px", borderRadius: "4px", 
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div style={{ width: "100%", backgroundColor: "white", padding: "6px", borderRadius: "8px", boxSizing: "border-box" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Anniversary Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>
            <div style={{ width: "47%" }}>
              <img
                src={AnniversaryOne}
                alt="Anniversary template one"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Classic Anniversary
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.first) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.first) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.first)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.first)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

            <div style={{ width: "47%" }}>
              <img
                src={AnniversaryTwo}
                alt="Anniversary template two"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Golden Celebration
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.second) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.second) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.second)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("workAnniversary", CARD_TEMPLATE_IDS.workAnniversary.second)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div style={{ width: "100%", backgroundColor: "white", padding: "6px", borderRadius: "8px", boxSizing: "border-box" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Holiday Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>

            <div style={{ width: "47%" }}>
              <img
                src={thanksgiving1}
                alt="Holiday template one"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Thanksgiving Warmth
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.first) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.first) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.first)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.first)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

            <div style={{ width: "47%" }}>
              <img
                src={thanksgiving2}
                alt="Holiday template two"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Autumn Gratitude
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.second) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.second) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.second)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("thanksgiving", CARD_TEMPLATE_IDS.thanksgiving.second)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div style={{ width: "100%", backgroundColor: "white", padding: "6px", borderRadius: "8px", boxSizing: "border-box" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Thank you Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>
            <div style={{ width: "47%" }}>
              <img
                src={thankYouOne}
                alt="Thank you template one"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Elegant Thanks
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("thankYou", CARD_TEMPLATE_IDS.thankYou.first) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("thankYou", CARD_TEMPLATE_IDS.thankYou.first) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("thankYou", CARD_TEMPLATE_IDS.thankYou.first)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("thankYou", CARD_TEMPLATE_IDS.thankYou.first)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

            <div style={{ width: "47%" }}>
              <img
                src={thankYouTwo}
                alt="Thank you template two"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: "12px 0 0 0" }}>
                Warm Appreciation
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isSetDefaultDisabled("thankYou", CARD_TEMPLATE_IDS.thankYou.second) ? "not-allowed" : "pointer",
                    border: "1px solid blue",
                    padding: "8px",
                    borderRadius: "4px",
                    opacity: isSetDefaultDisabled("thankYou", CARD_TEMPLATE_IDS.thankYou.second) ? 0.6 : 1,
                  }}
                  onClick={() => handleSetDefault("thankYou", CARD_TEMPLATE_IDS.thankYou.second)}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>
                    {getSetDefaultLabel("thankYou", CARD_TEMPLATE_IDS.thankYou.second)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "8px",
                    border: "1px solid red",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
