import React from "react"
import { makeStyles } from "@material-ui/core/styles"

// @material-ui/core components
import Grid from "@material-ui/core/Grid"
import InputAdornment from "@material-ui/core/InputAdornment"

// @material-ui/icons
import People from "@material-ui/icons/People";

//core components
import CustomInput from "../../components/CustomInput/CustomInput.js"
import GridItem from "../../components/Grid/GridItem.js"

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js"

const useStyles = makeStyles(styles)

export default function AddProposal() {
    const classes = useStyles()

    return (
        <Grid container>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                labelText="Disabled"
                id="disabled"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    disabled: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                id="regular"
                inputProps={{
                    placeholder: "Regular"
                }}
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                labelText="With floating label"
                id="float"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                labelText="Success input"
                id="success"
                success
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                labelText="Error input"
                id="error"
                error
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                labelText="With material Icons"
                id="material"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <People />
                    </InputAdornment>
                    )
                }}
                />
            </GridItem>
        </Grid>
    )
}

