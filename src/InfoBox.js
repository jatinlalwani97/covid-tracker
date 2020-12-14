import React from 'react';
import "./InfoBox.css";
import {Card, CardContent, Typography} from "@material-ui/core";


function InfoBox({title,cases,total, ...props}) {
    return (
        <Card onClick={props.onClick} className="infobox">
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className="infoBox__cases">{total} Total</h2>
                <Typography className="infoBox__total" color="textSecondary">{cases}</Typography>
            </CardContent>            
        </Card>
    )
}

export default InfoBox;
