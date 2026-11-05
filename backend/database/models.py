from peewee import * # type: ignore

# Write here your models (feel free to use any ORM you want)

database = SqliteDatabase('database/database.db')

class BaseModel(Model):
    class Meta:
        database = database

class Account(BaseModel):
    balance = IntegerField(constraints=[SQL("DEFAULT 0")], null=True)
    name = CharField(max_length=20)

    class Meta(BaseModel.Meta):
        table_name = 'Account'

class Category(BaseModel):
    name = CharField(max_length=20)
    type = CharField(choices=(("expense", "expense"), ("income", "income")))

    class Meta(BaseModel.Meta):
        table_name = 'Category'

class Transaction(BaseModel):
    account = ForeignKeyField(column_name='account_id', field='id', model=Account, null=True)
    amount = IntegerField()
    category = ForeignKeyField(column_name='category_id', field='id', model=Category, null=True)

    class Meta(BaseModel.Meta):
        table_name = 'Transaction'
