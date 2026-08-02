"""
Auto-suggests a priority (low/normal/high) and short tag for a task,
based on its title + notes.

Uses a keyword-based heuristic. This means it runs instantly with zero
setup and zero cost — no API key needed to demo or test it.
"""

URGENT_WORDS = {"urgent", "asap", "today", "deadline", "overdue", "now"}
LOW_WORDS = {"someday", "eventually", "maybe", "whenever", "idea"}


def suggest_priority_and_tag(title: str, notes: str = "") -> dict:
    text = f"{title} {notes}".lower()

    if any(word in text for word in URGENT_WORDS):
        priority = "high"
    elif any(word in text for word in LOW_WORDS):
        priority = "low"
    else:
        priority = "normal"

    tag = "work"
    if any(w in text for w in ["buy", "grocery", "store", "shopping"]):
        tag = "errand"
    elif any(w in text for w in ["call", "email", "message", "reply"]):
        tag = "communication"
    elif any(w in text for w in ["doctor", "gym", "workout", "health"]):
        tag = "health"

    return {"priority": priority, "tag": tag}