export async function checkTieredBadge( //what will method signature be? what's it returning
    user: User, counterField: string, tier1: number, tier2: number, tier3: number
) {
    //operating on the assumption that the badges database has not been created yet.

    //getting badges from the /badges endpoint
    let badges = null;
    try {
        const response = await fetch('/badges');
        if (response.ok) {
            badges = await response.json();
        }
    } catch (error) {
        console.log("Error fetching badge catalog");
    }
    if (!badges) {
        return null;
    }
    const tierList = [tier3, tier2, tier1];
    for (const tier in tierList) {
        const badge = badges.find(b => b.category === counterField && b.tier === tier);
        if (!badge) {
            continue;
        }
        const userCounterField = user[counterField]; //no counterField yet?
        if (userCounterField >= badge.count && user.badges.includes(badge.name) == false) {
            return badge.name;
        }
    }
    return null;
};