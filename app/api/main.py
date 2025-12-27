from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/merchant")
async def merchant():
    return {"merchant": "list"}


@app.get("/taoke")
async def taoke():
    return {"taoke": "list"}


@app.get("/merchant/dashboard")
async def merchant_dashboard(merchant_id: int = 1, lookback_days: int = 7, items_limit: int = 20, min_pv: int = 0, include_items: int = 0):
    # Minimal dashboard response. If real data not available, mark as pending.
    overview = {
        "merchant_id": merchant_id,
        "lookback_days": lookback_days,
        "status": "no_tianchi_data",  # placeholder: real Tianchi data not yet integrated
        "note": "待导入天池用户行为数据后启用诊断/触达建议"
    }
    metrics = {
        "visitors": None,
        "orders": None,
        "gmv": None
    }
    lifecycle = {
        "diagnostics": [],
        "automation_recommendations": []
    }
    journey = {
        "browsing": None,
        "favorites": None,
        "add_to_cart": None,
        "checkout": None
    }
    advice = [
        {"type": "note", "text": "数据未接入：请导入天池用户行为数据以获取诊断/建议。"}
    ]
    return {
        "overview": overview,
        "metrics": metrics,
        "lifecycle": lifecycle,
        "journey": journey,
        "advice": advice
    }
