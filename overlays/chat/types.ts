export interface MessageAddData {
    Message: MessagePart[];
    MessageID: string;
    User: User;
}

export interface MessageRemoveData {
    MessageID: string;
    Username: string
}

export interface MessagePart {
    // "Text" or "Emote"
    Type: string;
    // A word of text or link to the emote
    Content: string;
}

export interface User {
    AccountAgestring: string;
    AccountDate: Date;
    AccountDatestring: string;
    AccountDays: number;
    AlejoPronoun: string;
    AllPlatforms: number[]; // Which number is which platform?
    AvatarLink: string;
    ChannelLink: string;
    Color: string; // Color hex
    ColorInApp: string;
    CurrencyAmounts: Record<string, number>;
    CustomCommandIDs: string[]; // I don't know what this is
    CustomTitle: string | null; // I don't know what this is
    DisplayName: string;
    DisplayRoles: number[]; // Which number is which role?
    DisplayRolesString: string;
    FollowAgeString: string;
    FollowDate: Date | null;
    FollowDateString: string;
    FollowDays: number;
    FollowMonths: number;
    FullDisplayName: string;
    HasWhisperNumber: boolean; // I don't know what this is
    ID: string; // Mixitup internal id?
    InventoryAmounts: Record<string, any>; // I don't know what this is
    IsExternalSubscriber: boolean; // I don't know what this is
    IsFollower: boolean;
    IsInChat: boolean;
    IsLoading: boolean; // I don't know what this is
    IsNotLoading: boolean;
    IsPlatformSubscriber: boolean;
    IsRegular: boolean;
    IsSpecialtyExcluded: boolean; // I don't know what this is
    IsSubscriber: boolean;
    IsUnassociated: boolean; // I don't know what this is
    LastActivity: Date;
    LastActivityAgeString: string;
    LastActivityDateString: string;
    LastActivityDays: number;
    LastSeenString: string;
    LastUpdated: Date;
    ModerationStrikes: number;
    Notes: string | null;
    OnlineViewingHoursOnly: number;
    OnlineViewingMinutes: number;
    OnlineViewingMinutesOnly: number;
    OnlineViewingTimeString: string;
    PatreonID: null; // I don't know what this is
    PatreonTier: null; // I don't know what this is
    PatreonUser: null; // I don't know what this is
    Platform: number;
    PlatformBadgeFullLink: string;
    PlatformBadgeLink: string;
    PlatformID: string;
    PlatformImageURL: string;
    PlatformRoleBadgeLink: string | null;
    PlatformSpecialtyBadgeLink: string | null;
    PlatformSubscriberBadgeLink: string | null;
    PrimaryCurrency: number;
    PrimaryRankNameAndPoints: string;
    PrimaryRankPoints: number;
    PrimaryRole: number; // Which number is which role?
    PrimaryRoleString: string;
    RolesString: string;
    ShowPlatformBadge: boolean;
    ShowPlatformImage: boolean;
    ShowPlatformRoleBadge: boolean;
    ShowPlatformSpecialtyBadge: boolean;
    ShowPlatformSubscriberBadge: boolean;
    ShowUserAvatar: boolean;
    SortableID: string;
    SubscribeAgeString: string;
    SubscribeDate: Date | null;
    SubscribeDateString: string;
    SubscribeDays: number;
    SubscribeMonths: number;
    SubscriberTier: number;
    SubscriberTierString: string;
    Title: string; // I don't know what this is
    TotalAmountDonated: number;
    TotalChatMessageSent: number;
    TotalCommandsRun: number;
    TotalMonthsSubbed: number;
    TotalStreamsWatched: number;
    TotalSubsGifted: number;
    TotalSubsReceived: number;
    TotalTimesTagged: number;
    Username: string;
    WhispererNumber: number; // I don't know what this is
}
