import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../frontend/components/Home/Home";
import API from "../api/api";

jest.mock("../api/api", () => ({
  __esModule: true,
  default: {
    getRecipes: jest.fn(),
    searchRecipes: jest.fn(),
    deleteRecipe: jest.fn(),
  },
}));

describe("Home Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");

    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders header, footer and search bar", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      expect(screen.getAllByText("Recipe Finder")).toHaveLength(2);

      expect(
        screen.getByPlaceholderText("Search recipes..."),
      ).toBeInTheDocument();

      expect(screen.getByText("Made with")).toBeInTheDocument();
    });

    it("renders add recipe card", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("add-recipe-btn")).toBeInTheDocument();
      });
    });
  });

  describe("getRecipes API", () => {
    it("loads recipes successfully", async () => {
      API.getRecipes.mockResolvedValue({
        data: [
          {
            _id: "1",
            name: "Chocolate Cake",
            category: "Dessert",
            cuisine: "American",
            image: "cake.jpg",
          },
        ],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      });

      expect(API.getRecipes).toHaveBeenCalledWith("test-token");
    });

    it("shows error when getRecipes fails", async () => {
      API.getRecipes.mockRejectedValue(new Error("Server Error"));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
      });
    });

    it("shows loading while fetching recipes", async () => {
      API.getRecipes.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      expect(screen.getByText("Loading Recipes...")).toBeInTheDocument();
    });

    it("removes loading after successful fetch", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Loading Recipes..."),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Search", () => {
    it("searches recipes successfully", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      API.searchRecipes.mockResolvedValue({
        data: [
          {
            _id: "2",
            name: "Chicken Biryani",
            category: "Main",
            cuisine: "Indian",
            image: "biryani.jpg",
          },
        ],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      const input = screen.getByPlaceholderText("Search recipes...");

      fireEvent.change(input, {
        target: {
          value: "Chicken",
        },
      });

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Chicken Biryani")).toBeInTheDocument();
      });

      expect(API.searchRecipes).toHaveBeenCalledWith("Chicken", "test-token");
    });

    it("shows no recipes found message", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      API.searchRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText("Search recipes..."), {
        target: {
          value: "abc",
        },
      });

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("No recipes found.")).toBeInTheDocument();
      });
    });

    it("shows search failed error", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      API.searchRecipes.mockRejectedValue(new Error("Failed"));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText("Search recipes..."), {
        target: {
          value: "cake",
        },
      });

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Search failed.")).toBeInTheDocument();
      });
    });

    it("reloads all recipes when search is empty", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(API.getRecipes).toHaveBeenCalled();
      });
    });
  });

  describe("Add Recipe Modal", () => {
    it("opens add recipe modal", async () => {
      API.getRecipes.mockResolvedValue({
        data: [],
      });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );

      fireEvent.click(screen.getByTestId("add-recipe-btn"));

      await waitFor(() => {
        expect(screen.getByText("Add Recipe")).toBeInTheDocument();
      });
    });
  });
});
