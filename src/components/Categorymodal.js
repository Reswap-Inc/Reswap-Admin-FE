import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// const categories = [
//   {
//     id: 1,
//     name: "Building Materials (10)",
//     subcategories: ["Cement", "Bricks", "Steel"],
//   },
//   { id: 2, name: "Consumer Electronics (4)", subcategories: [] },
//   { id: 3, name: "Electronic Components (10)", subcategories: [] },
//   { id: 4, name: "Food & Beverages (10)", subcategories: [] },
//   { id: 5, name: "Hardware (5)", subcategories: [] },
//   { id: 6, name: "Home Decor (5)", subcategories: [] },
// ];

const Categorymodal = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState([]);

  const handleCheckboxChange = (category, subcategory) => {
    const key = `${category}-${subcategory}`;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 500,
          backgroundColor: "white",
          margin: "10% auto",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Categories
        </Typography>
        {categories.map((category) => (
          <Accordion key={category.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((sub, idx) => (
                    <ListItem key={idx} dense>
                      <ListItemIcon>
                        <Checkbox
                          checked={selected.includes(`${category.name}-${sub}`)}
                          onChange={() =>
                            handleCheckboxChange(category.name, sub)
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary={sub} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No subcategories</Typography>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          variant="contained"
          color="success"
          onClick={handleClose}
          sx={{ marginTop: "10px" }}
        >
          Ok
        </Button>
      </Box>
    </Modal>
  );
};

export default Categorymodal;
