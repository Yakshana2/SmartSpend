from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# --- Auth Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --- Category Schemas ---

class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#6366f1"
    icon: Optional[str] = "tag"


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# --- Expense Schemas ---

class ExpenseBase(BaseModel):
    title: str
    amount: float
    description: Optional[str] = None
    date: datetime
    category_id: Optional[int] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    category_id: Optional[int] = None


class ExpenseOut(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


class ExpenseSummary(BaseModel):
    total: float
    count: int
    by_category: list[dict]
