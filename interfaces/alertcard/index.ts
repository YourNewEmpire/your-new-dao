import React from "react";

export interface AlertCardProps {
    title: string
    body: string | React.ReactChild
    icon?: JSX.Element
    success?: boolean
    info?: boolean
    warning?: boolean
    failure?: boolean
}