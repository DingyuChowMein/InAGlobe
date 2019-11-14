import React, { Component } from "react"
import PerfectScrollbar from 'react-perfect-scrollbar'

import { 
    withStyles, 
    Card,
    List,
} from "@material-ui/core"

import styles from "../../assets/jss/components/cardsListStyle"
import 'react-perfect-scrollbar/dist/css/styles.css'

class CardsList extends Component {

    render() {
        const { classes, title, cardData, contentStruct } = this.props
        return (
            <div>
                <h3 className={classes.subtitle}>{title}</h3>
                <PerfectScrollbar component="div" className={classes.scrollbar}>
                    <List>
                        {cardData.map((card, key) => (
                            <Card key={key} className={classes.card}>
                                {contentStruct(card)}
                            </Card>
                        ))}
                    </List>
                </PerfectScrollbar>
            </div>
        )
    }
}

export default withStyles(styles)(CardsList)