import React from 'react'
import { Card, IconButton, Grid } from '@mui/material'
import { Delete } from '@mui/icons-material'

function DeleteButton(props) {
    return (
        <Grid item xs={props.xs ? props.xs : 12} md={props.md ? props.md : 12} lg={props.lg ? props.lg : 12}  >
            <Card variant='outlined' style={{ width: 'min-content', alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                <IconButton style={{ borderRadius: 0 }} onClick={() => { props.onClick && props.onClick() }}>
                    <Delete />
                </IconButton>
            </Card>
        </Grid>
    )
}

export default DeleteButton