let openPopupCallback: ((infoObject: any) => void) | null = null;

let closePopupCallback: (() => void) | null = null;

export function registerPopup(openCallback, closeCallback) {

    openPopupCallback = openCallback;
    closePopupCallback = closeCallback;

}

export function openPopup(infoObject) {

    if (openPopupCallback) {

        openPopupCallback(infoObject);

    }

}

export function closePopup() {

    if (closePopupCallback) {

        closePopupCallback();

    }

}