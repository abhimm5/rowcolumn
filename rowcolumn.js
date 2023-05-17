"use strict"
import {
    addSyntax
} from './main/syntax/syntax.js'
import Grid from './main/grid/gridconstructor.js'
import style from './main/grid/cartesiansystem.js'
import assignCoordinate from './main/grid/assigncoordinate.js'
import children from './main/grid/children.js'
import {
    addRearrange
} from './main/rearrange/rearrange.js'
import {
    addDevise
} from './main/devise/devise.js'
import {
    addExtract
} from './main/extract/extract.js'
import {
    addComponents
} from './main/add/add.js'
import set from './apply/applygrid.js'
import {
    breakpoint,
    order,
    offset,
    property,
    childProperty
} from './components/names/functions.js'


window.addEventListener("load", () => {
    let parent = 100;
    let lg = 61.2;
    let sm = 38.8;
    addSyntax()
    addRearrange()
    addDevise()
    addExtract()
    addComponents()
    const nodeList = document.querySelectorAll("div[layout]")
    const composeObject = []
    let i
    for (i = 0; i < nodeList.length; i++) {
        var att = nodeList[i].getAttribute("layout")
        composeObject[i] = eval(att)
        set(composeObject[i], nodeList[i])
    }
})