<GradientBox>
      <h1 className="text-2xl font-semibold">Add Listing</h1>
      <FormCard>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Details Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Listing Type
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {ListingType?.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    formData.listingType === type.value
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setFormData((prev) => ({ ...prev, listingType: type.value }))}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.listingType === type.value ? "#23BB67" : "white",
                    color:
                      formData.listingType === type.value ? "white" : "#10552F",
                    border: `1px solid ${formData.listingType === type.value ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.listingType === type.value
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </Box>

            {errors.listingType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.listingType}
              </Typography>
            )}

            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Select Property Type
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {propertyType?.map((type) => (
                <Button
                  key={type?.id}
                  variant={
                    formData.propertyType === type?.id
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setFormData((prev) => ({ ...prev, propertyType: type.id }))}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.propertyType === type?.id ? "#23BB67" : "white",
                    color:
                      formData.propertyType === type?.id ? "white" : "#10552F",
                    border: `1px solid ${formData.propertyType === type?.id ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.propertyType === type?.id
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.name}
                </Button>
              ))}
            </Box>

            {errors.propertyType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.propertyType}
              </Typography>
            )}

            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Select Unit Type
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {unitType?.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    formData.unitType === type.id ? "contained" : "outlined"
                  }
                  onClick={() => setFormData((prev) => ({ ...prev, unitType: type.id }))}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.unitType === type.id ? "#23BB67" : "white",
                    color: formData.unitType === type.id ? "white" : "#10552F",
                    border: `1px solid ${formData.unitType === type.id ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.unitType === type.id
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.name}
                </Button>
              ))}
            </Box>

            {errors.unitType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.unitType}
              </Typography>
            )}

            {formData.listingType !== "unit" && (
              <>
                <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
                  Select Room Type
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
                  {roomType?.map((type) => (
                    <Button
                      key={type.id}
                      variant={
                        formData.roomType === type.id ? "contained" : "outlined"
                      }
                      onClick={() => setFormData((prev) => ({ ...prev, roomType: type.id }))}
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "14px",
                        backgroundColor:
                          formData.roomType === type.id ? "#23BB67" : "white",
                        color:
                          formData.roomType === type.id ? "white" : "#10552F",
                        border: `1px solid ${formData.roomType === type.id ? "#23BB67" : "#10552F"}`,
                        "&:hover": {
                          backgroundColor:
                            formData.roomType === type.id
                              ? "#10552F"
                              : "rgba(35, 187, 103, 0.1)",
                        },
                      }}
                    >
                      {type.name}
                    </Button>
                  ))}
                </Box>

                {errors.roomType && (
                  <Typography sx={{ color: "error.main", mt: 1 }}>
                    {errors.roomType}
                  </Typography>
                )}
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />

            {/* Location Details */}
            <Typography variant="h6" sx={{ color: "#10552F", mb: 1 }}>
              Location Details
            </Typography>

            <Grid container alignItems="center" spacing={2} marginTop={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip"
                  name="location.postalCode"
                  value={formData.location.postalCode}
                  onChange={handleChange}
                  error={!!errors.location?.postalCode}
                  helperText={errors.location?.postalCode}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="location.country"
                  value={formData?.location?.country}
                  onChange={handleChange}
                  error={!!errors?.["location.country"]}
                  helperText={errors?.["location.country"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: !!formData.location.country,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  error={!!errors?.["location.state"]}
                  helperText={errors?.["location.state"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: !!formData.location.state,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  error={!!errors?.["location.city"]}
                  helperText={errors?.["location.city"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: !!formData.location.city,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 1"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  error={!!errors?.location?.address}
                  helperText={errors?.location?.address}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 2"
                  name="location.address2"
                  value={formData.location.address2}
                  onChange={handleChange}
                  error={!!errors?.location?.address2}
                  helperText={errors?.location?.address2}
                />
              </Grid>
              
              {formData.listingType === "room" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Room Number"
                    name="location.roomNumber"
                    value={formData.location.roomNumber}
                    onChange={handleChange}
                    error={!!errors?.location?.roomNumber}
                    helperText={errors?.location?.roomNumber}
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Property Details Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Property Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Preferences</InputLabel>
                  <Select
                    multiple
                    name="foodPreferences"
                    value={formData.foodPreferences}
                    onChange={(e) => setFormData((prev) => ({ ...prev, foodPreferences: e.target.value }))}
                    renderValue={(selected) => {
                      return foodPreferencesOptions
                        .filter(option => selected.includes(option.id))
                        .map(option => option.name)
                        .join(', ');
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                    }}
                  >
                    {foodPreferencesOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <Checkbox 
                          checked={formData.foodPreferences?.indexOf(option.id) > -1} 
                        />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available From"
                  name="availableFrom"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.availableFrom}
                  onChange={handleChange}
                  error={!!errors.availableFrom}
                  helperText={errors.availableFrom}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#23BB67",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available Till"
                  name="availableTill"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.availableTill}
                  onChange={handleChange}
                  error={!!errors.availableTill}
                  helperText={errors.availableTill}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#23BB67",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="availability.flexible"
                      checked={formData.availability.flexible}
                      onChange={handleChange}
                    />
                  }
                  label="Date Flexible"
                />
              </Grid>

              {/* Bedrooms */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: errors?.configurationHouse?.bedrooms?.number ? "error.main" : "#10552F", fontWeight: 500 }}>
                  Number of Bedrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.bedrooms.number.toString()}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({
                        ...prev,
                        configurationHouse: {
                          ...prev.configurationHouse,
                          bedrooms: { number: newValue },
                        },
                      }));
                    }
                  }}
                  fullWidth
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors?.configurationHouse?.bedrooms?.number && (
                  <FormHelperText error>
                    {errors.configurationHouse.bedrooms.number}
                  </FormHelperText>
                )}
              </Grid>

              {/* Bathrooms */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: errors?.configurationHouse?.bathrooms?.number ? "error.main" : "#10552F", fontWeight: 500 }}>
                  Number of Bathrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.bathrooms.number.toString()}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({
                        ...prev,
                        configurationHouse: {
                          ...prev.configurationHouse,
                          bathrooms: { number: newValue },
                        },
                      }));
                    }
                  }}
                  fullWidth
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors?.configurationHouse?.bathrooms?.number && (
                  <FormHelperText error>
                    {errors.configurationHouse.bathrooms.number}
                  </FormHelperText>
                )}
              </Grid>

              {/* Balconies */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: errors?.configurationHouse?.balcony?.number ? "error.main" : "#10552F", fontWeight: 500 }}>
                  Number of Balconies
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.balcony.number.toString()}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({
                        ...prev,
                        configurationHouse: {
                          ...prev.configurationHouse,
                          balcony: { number: newValue },
                        },
                      }));
                    }
                  }}
                  fullWidth
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors?.configurationHouse?.balcony?.number && (
                  <FormHelperText error>
                    {errors.configurationHouse.balcony.number}
                  </FormHelperText>
                )}
              </Grid>

              {/* Parking */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: errors?.configurationHouse?.parking?.number ? "error.main" : "#10552F", fontWeight: 500 }}>
                  Car Parking
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.parking.number.toString()}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({
                        ...prev,
                        configurationHouse: {
                          ...prev.configurationHouse,
                          parking: { number: newValue },
                        },
                      }));
                    }
                  }}
                  fullWidth
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors?.configurationHouse?.parking?.number && (
                  <FormHelperText error>
                    {errors.configurationHouse.parking.number}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}>
                  Pets
                </Typography>
                <ToggleButtonGroup
                  value={formData.arePetsAllowed ? "Allowed" : "Not Allowed"}
                  exclusive
                  onChange={(_, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      arePetsAllowed: value === "Allowed",
                    }))
                  }
                  fullWidth
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    "& .MuiToggleButton-root": {
                      flex: 1,
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  <ToggleButton value="Not Allowed">Not Allowed</ToggleButton>
                  <ToggleButton value="Allowed">Allowed</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {formData?.arePetsAllowed && (
                <Grid item xs={12}>
                  <Box borderRadius="8px" mt={2} p={2} bgcolor="#f0f7f2">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Pets Include:
                    </Typography>
                    {formData.petsAllowed && Array.isArray(formData.petsAllowed) && formData.petsAllowed.length > 0 ? (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {formData.petsAllowed.map((petId) => (
                          <Typography
                            key={petId}
                            sx={{
                              display: "inline-block",
                              backgroundColor: "#23BB67",
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              margin: "4px",
                              fontSize: "0.875rem",
                            }}
                          >
                            {getPetNameById(petId)}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2 }}>
                        No pets selected
                      </Typography>
                    )}
                    <Button onClick={() => setOpenPetModel(true)}>Add More</Button>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}>
                  Furnishing Status
                </Typography>
                <ToggleButtonGroup
                  value={formData.furnishing || "Unfurnished"}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({
                        ...prev,
                        furnishing: newValue,
                      }));
                    }
                  }}
                  fullWidth
                >
                  <ToggleButton value="Unfurnished">Unfurnished</ToggleButton>
                  <ToggleButton value="Semi-Furnished">Semi-Furnished</ToggleButton>
                  <ToggleButton value="Furnished">Furnished</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {formData.furnishing && formData.furnishing !== "Unfurnished" && (
                <Grid item xs={12}>
                  <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Furniture Includes
                    </Typography>
                    <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}>
                      {formData.furniture.map((item) => (
                        <Grid container key={item.id} alignItems="center" spacing={2}>
                          <Grid item xs={4}>
                            <Typography sx={{ color: "#333", fontWeight: 500 }}>
                              {item.name}({item.count})
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                    <Button onClick={() => setOpenFurnishingModal(true)} sx={{ mt: 2 }}>
                      Add/Edit Furniture
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Pricing Section */}
            <Box>
              <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
                Pricing Details
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Expected Rent ($)"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
                type="number"
                error={!!errors.rentAmount}
                helperText={errors.rentAmount}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Security Deposit ($)"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                type="number"
                error={!!errors.depositAmount}
                helperText={errors.depositAmount}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Sublease Transfer Charges ($)"
                name="subleaseCharges"
                value={formData.subleaseCharges}
                onChange={handleChange}
                type="number"
              />

              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                type="tel"
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="price.flexible"
                    checked={formData.price?.flexible}
                    onChange={(event) => {
                      setFormData((prev) => ({
                        ...prev,
                        price: {
                          ...prev.price,
                          flexible: event.target.checked,
                        },
                      }));
                    }}
                  />
                }
                label="Price Negotiable"
              />
            </Box>

            {/* Images Section */}

            {/* Image Preview Grid */}
            <Box>
              <Typography variant="h6" sx={{ color: "#10552F", mb: 2 }}>
                Property Images (Max 3)
              </Typography>
              <Grid container spacing={2}>
                {unitImages.map((image, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        border: "2px dashed #23BB67",
                        borderRadius: 2,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8faf8",
                        overflow: "hidden",
                        "&:hover": {
                          borderColor: "#10552F",
                        },
                      }}
                    >
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt={`property-${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                              },
                            }}
                            onClick={() => handleImageRemove(index, "property")}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            document
                              .getElementById(`property-upload-${index}`)
                              .click()
                          }
                        >
                          <AddPhotoAlternateIcon
                            sx={{ fontSize: 40, color: "#23BB67", mb: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload
                          </Typography>
                        </Box>
                      )}
                      <input
                        type="file"
                        id={`property-upload-${index}`}
                        accept="image/*"
                        hidden
                        onChange={(event) =>
                          handleImageUploadfur(event, index, "property")
                        }
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={handleSubmit}
              sx={{
                mt: 4,
                backgroundColor: "#23BB67",
                color: "white",
                "&:hover": { backgroundColor: "#10552F" },
                px: 4,
                py: 1,
              }}
            >
              Submit Listing
            </Button>
          </Box>
        </Box>

        {/* Furnishing Modal */}
        {openFurnishingModal && (
          <Modal
            open={openFurnishingModal}
            onClose={() => setOpenFurnishingModal(false)}
          >
            <Box
              sx={{
                position: "absolute",
                maxWidth: 600,
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
                margin: "auto",
                mt: 5,
                p: 4,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: "#10552F", fontWeight: 600 }}>
                  Furnishing Details
                </Typography>
                <Button onClick={() => setOpenFurnishingModal(false)}>✖</Button>
              </Box>

              {/* Add Furnishing Details */}

              {/* Add/Edit Furniture Modal Implementations Here */}
            </Box>
          </Modal>
        )}

        {/* Pets Modal */}
        {openPetModel && (
          <Modal open={openPetModel} onClose={() => setOpenPetModel(false)}>
            <Box
              sx={{
                position: "absolute",
                maxWidth: 600,
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
                margin: "auto",
                mt: 5,
                p: 4,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: "#10552F", fontWeight: 600 }}>
                  Add Pets
                </Typography>
                <Button onClick={() => setOpenPetModel(false)}>✖</Button>
              </Box>

              {/* Available Pets Section */}

              {/* Implement Your Pet Selection Criteria Here */}
            </Box>
          </Modal>
        )}
      </FormCard>
    </GradientBox>)