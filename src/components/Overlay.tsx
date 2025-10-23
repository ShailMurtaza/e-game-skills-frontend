export default function Overlay({ display }: { display: "hidden" | "" }) {
    return (
        <div
            className={`fixed w-full h-full top-0 left-0 bg-black opacity-80 z-20 ${display}`}
        ></div>
    );
}
