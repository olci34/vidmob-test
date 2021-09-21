export default function ErrorsContainer(props) {
    const errors = props.errors
    return (
        <div id="errors">
            <p aria-label="current-errors">{errors}</p>
        </div>
    )
}
