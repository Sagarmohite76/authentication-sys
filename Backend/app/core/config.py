from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DB_HOST=os.getenv("DB_Host","localhost").strip()
    DB_USER=os.getenv("DB_User","root").strip()
    DB_PASSWORD=os.getenv("DB_Password","").strip()
    DB_NAME=os.getenv("DB_Name","").strip()

    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    )

# print(Config.DATABASE_URL)