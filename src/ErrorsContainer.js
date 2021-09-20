export default function ErrorsContainer(props) {
    const errors = props.errors
    return (
        <div id="errors">
            <p>{errors}</p>
        </div>
    )
}
