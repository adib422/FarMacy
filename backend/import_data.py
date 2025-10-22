import pandas as pd
import mysql.connector
from mysql.connector import Error

# Database configuration
config = {
    'host': 'localhost',
    'user': 'root',              # Change to your MySQL username
    'password': 'adib@123',      # Change to your MySQL password
    'database': 'medicine_store'
}

def import_csv_to_mysql():
    try:
        # Read CSV
        print("Reading CSV file...")
        df = pd.read_csv('medicines.csv')
        
        # Connect to MySQL
        print("Connecting to MySQL...")
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        # Insert data
        print(f"Importing {len(df)} medicines...")
        
        insert_query = """
        INSERT INTO medicines (id, medicine_name, mrp, brand, pack_size, composition, category, popularity)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        medicine_name = VALUES(medicine_name),
        mrp = VALUES(mrp),
        brand = VALUES(brand),
        pack_size = VALUES(pack_size),
        composition = VALUES(composition),
        category = VALUES(category),
        popularity = VALUES(popularity)
        """
        
        # Convert DataFrame to list of tuples
        data = []
        for index, row in df.iterrows():
            data.append((
                int(row['id']) if pd.notna(row['id']) else None,
                str(row['medicine_name']) if pd.notna(row['medicine_name']) else '',
                float(row['mrp']) if pd.notna(row['mrp']) else 0,
                str(row['brand']) if pd.notna(row['brand']) else '',
                str(row['pack_size']) if pd.notna(row['pack_size']) else '',
                str(row['composition']) if pd.notna(row['composition']) else '',
                str(row['category']) if pd.notna(row['category']) else 'Other',
                float(row['popularity']) if pd.notna(row['popularity']) else 0
            ))
            
            # Show progress every 1000 rows
            if (index + 1) % 1000 == 0:
                print(f"✓ Imported {index + 1} medicines...")
        
        # Execute batch insert
        cursor.executemany(insert_query, data)
        connection.commit()
        
        print(f"\n✓ Successfully imported {len(df)} medicines to MySQL!")
        print(f"✓ Database: {config['database']}")
        print(f"✓ Table: medicines")
        
    except Error as e:
        print(f"❌ Error: {e}")
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("✓ MySQL connection closed")

if __name__ == "__main__":
    import_csv_to_mysql()
