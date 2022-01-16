export interface AlertCardProps {
    title: string
    body: string
    icon?: JSX.Element
    success?: boolean
    info?: boolean
    warning?: boolean
    failure?: boolean
}