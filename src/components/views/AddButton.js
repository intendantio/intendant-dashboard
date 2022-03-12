import React from 'react'
import { Card, IconButton, Grid } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function AddButton(props) {
    return (
        <Grid item xs={12} md={12} lg={12}>
            <Card variant='outlined' style={{ width: 'min-content', alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                <Link to={props.to}>
                    <IconButton style={{ borderRadius: 0 }} >
                        <Add />
                    </IconButton>
                </Link>
            </Card>
        </Grid>
    )
}

export default AddButton