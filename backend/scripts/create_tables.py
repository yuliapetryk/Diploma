from app.database import engine, Base, create_db

if __name__ == "__main__":
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped successfully!")

    create_db()
    print("All tables created successfully!")
