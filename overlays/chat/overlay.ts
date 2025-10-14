import type { MessageAddData, MessageRemoveData } from "./types";

const messageTemplate = document.querySelector("#message");
const avatarTemplate = document.querySelector("#avatar");
const badgeTemplate = document.querySelector("#badge");
const pronounsTemplate = document.querySelector("#pronouns");
const usernameTemplate = document.querySelector("#username");
const textTemplate = document.querySelector("#text");
const emoteTemplate = document.querySelector("#emote");

const list: HTMLElement = document.getElementById("list");

const maxMessages = 100;
var pendingMessage: HTMLDivElement[] = [];

const messageDelayTime: number = { MessageDelayTime };
const messageRemovalTime: number = { MessageRemovalTime };
const addMessagesToTop: boolean = { AddMessagesToTop };
const displayAlejoPronouns: boolean = { DisplayAlejoPronouns };
const showPlatformBadge: boolean = { ShowPlatformBadge };
const showRoleBadge: boolean = { ShowRoleBadge };
const showSubscriberBadge: boolean = { ShowSubscriberBadge };
const showSpecialtyBadge: boolean = { ShowSpecialtyBadge };

export function add(data: MessageAddData) {
    let message = messageTemplate.content.cloneNode(true);
    let messageSpan = message.querySelector(".message");

    let avatar = avatarTemplate.content.cloneNode(true);
    avatar.firstElementChild.src = data.User.AvatarLink;
    messageSpan.appendChild(avatar);

    addBadge(messageSpan, data.User.PlatformBadgeFullLink, showPlatformBadge);
    addBadge(messageSpan, data.User.PlatformRoleBadgeLink, showRoleBadge);
    addBadge(
        messageSpan,
        data.User.PlatformSubscriberBadgeLink,
        showSubscriberBadge,
    );
    addBadge(
        messageSpan,
        data.User.PlatformSpecialtyBadgeLink,
        showSpecialtyBadge,
    );

    if (displayAlejoPronouns && data.User.AlejoPronoun.length > 0) {
        let pronouns = pronounsTemplate.content.cloneNode(true);
        pronouns.firstElementChild.style.color = data.User.Color;
        pronouns.firstElementChild.innerHTML = `[${data.User.AlejoPronoun}]`;
        messageSpan.appendChild(pronouns);
    }

    let username = usernameTemplate.content.cloneNode(true);
    username.firstElementChild.style.color = data.User.Color;
    username.firstElementChild.innerHTML = data.User.DisplayName + ":";
    messageSpan.appendChild(username);

    data.Message.forEach((messagePart) => {
        if (messagePart.Type === "Text") {
            let text = textTemplate.content.cloneNode(true);
            text.firstElementChild.textContent = messagePart.Content;
            messageSpan.appendChild(text);
        } else if (messagePart.Type === "Emote") {
            let emote = emoteTemplate.content.cloneNode(true);
            emote.firstElementChild.src = messagePart.Content;
            messageSpan.appendChild(emote);
        }
    });

    let container = document.createElement("div");
    container.id = data.MessageID;
    container.setAttribute("username", data.User.Username);
    container.appendChild(message);

    pendingMessage.push(container);
    if (messageDelayTime > 0) {
        setTimeout(() => {
            addInternal(container);
        }, messageDelayTime * 1000);
    } else {
        addInternal(container);
    }
}

export function remove(data: MessageRemoveData) {
    for (let i = 0; i < pendingMessage.length; i++) {
        if (pendingMessage[i].id == data.MessageID) {
            pendingMessage.removeChild(pendingMessage[i]);
            return;
        } else if (
            pendingMessage[i].getAttribute("username") == data.Username
        ) {
            pendingMessage.removeChild(pendingMessage[i]);
            i--;
        }
    }

    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].id == data.MessageID) {
            list.removeChild(list.children[i]);
            return;
        } else if (list.children[i].getAttribute("username") == data.Username) {
            list.removeChild(list.children[i]);
            i--;
        }
    }
}

export function clear(data) {
    while (list.childElementCount > 0) {
        list.removeChild(list.lastElementChild);
    }
}

function addBadge(messageSpan, url, include) {
    if (include && url != null && url.length > 0) {
        let badge = badgeTemplate.content.cloneNode(true);
        badge.firstElementChild.src = url;
        messageSpan.appendChild(badge);
    }
}

function addInternal(message: HTMLDivElement) {
    if (!pendingMessage.includes(message)) {
        return;
    }
    pendingMessage.splice(message, 1);

    if (addMessagesToTop) {
        list.insertBefore(message, list.firstChild);
    } else {
        list.appendChild(message);
    }

    performAnimation(
        "{MessageAddedAnimationFramework}",
        "{MessageAddedAnimationName}",
        message,
    ).then((result) => {});

    if (messageRemovalTime > 0) {
        setTimeout(() => {
            removeInternal(message);
        }, messageRemovalTime * 1000);
    }

    if (list.childElementCount > maxMessages) {
        if (addMessagesToTop) {
            list.removeChild(list.lastChild);
        } else {
            list.removeChild(list.firstChild);
        }
    }
}

function removeInternal(message: HTMLDivElement) {
    performAnimation(
        "{MessageRemovedAnimationFramework}",
        "{MessageRemovedAnimationName}",
        message,
    ).then((result) => {
        list.removeChild(message);
    });
}
