import React from 'react'
import { Card, IconButton, Grid } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function AddButton(props) {
    return (

        <Grid item xs={props.xs ? props.xs : 12} md={props.md ? props.md : 12} lg={props.lg ? props.lg : 12} >
            <Card variant='outlined' style={{ width: props.fill ? '100%' : 'min-content', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', display: 'flex', height: '100%' }} >
                <Link to={props.to} style={{ width: '100%', height: '100%' }}>
                    <IconButton  style={{ borderRadius: 0, width: '100%', height: '100%' }} >
                        <Add fontSize={props.fill ? 'large' : 'normal'} />
                    </IconButton>
                </Link>
            </Card>
        </Grid>
    )
}

export default AddButton